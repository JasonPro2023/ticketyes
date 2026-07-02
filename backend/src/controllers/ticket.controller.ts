import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketStats,
} from '../services/ticket.service';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
} from '../validations/ticket.schema';

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : val;
}

export async function createTicketController(req: AuthRequest, res: Response): Promise<void> {
  const result = createTicketSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const ticket = await createTicket(result.data, req.userId!);
  res.status(201).json({ ticket });
}

export async function getTicketsController(req: AuthRequest, res: Response): Promise<void> {
  const result = ticketQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: 'Invalid query parameters',
        details: result.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const data = await getTickets(result.data);
  res.json(data);
}

export async function getTicketByIdController(req: AuthRequest, res: Response): Promise<void> {
  const id = getParam(req, 'id');

  const ticket = await getTicketById(id);

  if (!ticket) {
    res.status(404).json({
      error: { message: 'Ticket not found' },
    });
    return;
  }

  res.json({ ticket });
}

export async function updateTicketController(req: AuthRequest, res: Response): Promise<void> {
  const id = getParam(req, 'id');
  const result = updateTicketSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const existing = await getTicketById(id);
  if (!existing) {
    res.status(404).json({
      error: { message: 'Ticket not found' },
    });
    return;
  }

  const ticket = await updateTicket(id, result.data);
  res.json({ ticket });
}

export async function deleteTicketController(req: AuthRequest, res: Response): Promise<void> {
  const id = getParam(req, 'id');

  const existing = await getTicketById(id);
  if (!existing) {
    res.status(404).json({
      error: { message: 'Ticket not found' },
    });
    return;
  }

  await deleteTicket(id);
  res.status(204).send();
}

export async function getTicketStatsController(_req: AuthRequest, res: Response): Promise<void> {
  const stats = await getTicketStats();
  res.json({ stats });
}
