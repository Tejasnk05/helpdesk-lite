import type { Request, Response } from 'express';
import { createCommentSchema } from '../schemas/comment.schemas';
import { ticketIdParamSchema } from '../schemas/ticket.schemas';
import * as commentsService from '../services/comments.service';

export async function listComments(req: Request, res: Response) {
  const { id: ticketId } = ticketIdParamSchema.parse(req.params);
  const comments = await commentsService.listCommentsForTicket(ticketId);
  res.json(comments);
}

export async function createComment(req: Request, res: Response) {
  const { id: ticketId } = ticketIdParamSchema.parse(req.params);
  const input = createCommentSchema.parse(req.body ?? {});
  const comment = await commentsService.createComment(ticketId, input);
  res.status(201).json(comment);
}