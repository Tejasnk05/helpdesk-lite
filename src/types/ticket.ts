import type { TICKET_PRIORITIES, TICKET_STATUSES } from '../schemas/ticket.schemas';

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: Date;
  updated_at: Date;
}