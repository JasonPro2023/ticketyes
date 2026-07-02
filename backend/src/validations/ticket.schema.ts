import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
  category: z
    .enum(['BILLING', 'TECHNICAL', 'ACCOUNT', 'GENERAL', 'OTHER'])
    .optional()
    .default('GENERAL'),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .optional()
    .default('MEDIUM'),
});

export const updateTicketSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(200)
    .optional(),
  content: z
    .string()
    .min(10)
    .optional(),
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .optional(),
  category: z
    .enum(['BILLING', 'TECHNICAL', 'ACCOUNT', 'GENERAL', 'OTHER'])
    .optional(),
  assignedToId: z
    .string()
    .uuid()
    .nullable()
    .optional(),
});

export const ticketQuerySchema = z.object({
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .optional(),
  category: z
    .enum(['BILLING', 'TECHNICAL', 'ACCOUNT', 'GENERAL', 'OTHER'])
    .optional(),
  search: z
    .string()
    .max(100)
    .optional(),
  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
