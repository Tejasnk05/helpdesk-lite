import { db } from '../db/knex';
import { NotFoundError } from '../errors/HttpError';
import type { CreateTicketInput, ListTicketsQuery, UpdateTicketInput } from '../schemas/ticket.schemas';
import type { Ticket } from '../types/ticket';

const TABLE = 'tickets';

const notFound = (id: number) => new NotFoundError(`Ticket with id ${id} not found`);

export async function listTickets(filters: ListTicketsQuery): Promise<Ticket[]> {
  const query = db(TABLE).select('*').orderBy('id', 'desc');
  if (filters.status) {
    query.where({ status: filters.status });
  }
  return query;
}

export async function getTicketById(id: number): Promise<Ticket> {
  const ticket = await db(TABLE).where({ id }).first();
  if (!ticket) throw notFound(id);
  return ticket;
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const [ticket] = await db(TABLE).insert(input).returning('*');
  return ticket;
}

export async function updateTicket(id: number, input: UpdateTicketInput): Promise<Ticket> {
  const [ticket] = await db(TABLE)
    .where({ id })
    .update({ ...input, updated_at: db.fn.now() })
    .returning('*');
  if (!ticket) throw notFound(id);
  return ticket;
}

export async function deleteTicket(id: number): Promise<void> {
  const deletedCount = await db(TABLE).where({ id }).del();
  if (deletedCount === 0) throw notFound(id);
}