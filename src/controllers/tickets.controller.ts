import type { Request, Response } from 'express';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
} from '../schemas/ticket.schemas';
import * as ticketsService from '../services/tickets.service';

export async function listTickets(req: Request, res: Response) {
  const filters = listTicketsQuerySchema.parse(req.query);
  const tickets = await ticketsService.listTickets(filters);
  res.json(tickets);
}

export async function getTicket(req: Request, res: Response) {
  const { id } = ticketIdParamSchema.parse(req.params);
  const ticket = await ticketsService.getTicketById(id);
  res.json(ticket);
}

export async function createTicket(req: Request, res: Response) {
  const input = createTicketSchema.parse(req.body ?? {});
  const ticket = await ticketsService.createTicket(input);
  res.status(201).json(ticket);
}

export async function updateTicket(req: Request, res: Response) {
  const { id } = ticketIdParamSchema.parse(req.params);
  const input = updateTicketSchema.parse(req.body ?? {});
  const ticket = await ticketsService.updateTicket(id, input);
  res.json(ticket);
}

export async function deleteTicket(req: Request, res: Response) {
  const { id } = ticketIdParamSchema.parse(req.params);
  await ticketsService.deleteTicket(id);
  res.status(204).send();
}