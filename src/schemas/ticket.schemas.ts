import { z } from 'zod';

export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;
export const TICKET_STATUSES = ['open', 'in_progress', 'resolved'] as const;

const prioritySchema = z.enum(TICKET_PRIORITIES, {
  error: `priority must be one of: ${TICKET_PRIORITIES.join(', ')}`,
});
const statusSchema = z.enum(TICKET_STATUSES, {
  error: `status must be one of: ${TICKET_STATUSES.join(', ')}`,
});

// POST /tickets body
export const createTicketSchema = z.strictObject({
  title: z
    .string({ error: 'title is required and must be a string' })
    .trim()
    .min(1, 'title must not be empty')
    .max(200, 'title must be at most 200 characters'),
  description: z.string().trim().max(5000, 'description must be at most 5000 characters').nullish(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
});

// PATCH /tickets/:id body: every field optional, but at least one required
export const updateTicketSchema = z
  .strictObject({
    title: z
      .string()
      .trim()
      .min(1, 'title must not be empty')
      .max(200, 'title must be at most 200 characters'),
    description: z.string().trim().max(5000, 'description must be at most 5000 characters').nullable(),
    priority: prioritySchema,
    status: statusSchema,
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    error: 'Provide at least one field to update: title, description, priority, status',
  });

// :id in the URL arrives as a string, so convert it to a number
export const ticketIdParamSchema = z.object({
  id: z.coerce
    .number({ error: 'id must be a number' })
    .int('id must be an integer')
    .positive('id must be a positive integer'),
});

// GET /tickets?status=...
export const listTicketsQuerySchema = z.object({
  status: statusSchema.optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;