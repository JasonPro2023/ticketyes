import { Prisma, TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';
import { prisma } from '../config/database';
import { CreateTicketInput, UpdateTicketInput, TicketQueryInput } from '../validations/ticket.schema';

const ticketInclude = {
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
  assignedTo: {
    select: { id: true, name: true, email: true, role: true },
  },
} satisfies Prisma.TicketInclude;

export async function createTicket(data: CreateTicketInput, userId: string) {
  return prisma.ticket.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category as TicketCategory,
      priority: data.priority as TicketPriority,
      createdById: userId,
    },
    include: ticketInclude,
  });
}

export async function getTickets(query: TicketQueryInput) {
  const { status, priority, category, search, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TicketWhereInput = {};

  if (status) where.status = status as TicketStatus;
  if (priority) where.priority = priority as TicketPriority;
  if (category) where.category = category as TicketCategory;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: ticketInclude,
  });
}

export async function updateTicket(id: string, data: UpdateTicketInput) {
  const updateData: Prisma.TicketUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.status !== undefined) updateData.status = data.status as TicketStatus;
  if (data.priority !== undefined) updateData.priority = data.priority as TicketPriority;
  if (data.category !== undefined) updateData.category = data.category as TicketCategory;
  if (data.assignedToId !== undefined) {
    updateData.assignedTo = data.assignedToId
      ? { connect: { id: data.assignedToId } }
      : { disconnect: true };
  }

  return prisma.ticket.update({
    where: { id },
    data: updateData,
    include: ticketInclude,
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({
    where: { id },
  });
}

export async function getTicketStats() {
  const [total, byStatus, byPriority, byCategory] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.ticket.groupBy({
      by: ['priority'],
      _count: true,
    }),
    prisma.ticket.groupBy({
      by: ['category'],
      _count: true,
    }),
  ]);

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
    byPriority: Object.fromEntries(byPriority.map(p => [p.priority, p._count])),
    byCategory: Object.fromEntries(byCategory.map(c => [c.category, c._count])),
  };
}
