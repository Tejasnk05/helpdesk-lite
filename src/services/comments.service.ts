import { db } from '../db/knex';
import { NotFoundError } from '../errors/HttpError';
import type { CreateCommentInput } from '../schemas/comment.schemas';
import type { Comment } from '../types/comment';
import { getTicketById } from './tickets.service';

const TABLE = 'comments';

async function assertTicketExists(ticketId: number): Promise<void> {
  await getTicketById(ticketId);
}

export async function listCommentsForTicket(ticketId: number): Promise<Comment[]> {
  await assertTicketExists(ticketId);
  return db(TABLE).where({ ticket_id: ticketId }).orderBy('created_at', 'desc').orderBy('id', 'desc');
}

export async function createComment(ticketId: number, input: CreateCommentInput): Promise<Comment> {
  await assertTicketExists(ticketId);

  try {
    const [comment] = await db(TABLE).insert({ ticket_id: ticketId, body: input.body }).returning('*');
    return comment;
  } catch (err) {
    if ((err as { code?: string }).code === '23503') {
      throw new NotFoundError(`Ticket with id ${ticketId} not found`);
    }
    throw err;
  }
}