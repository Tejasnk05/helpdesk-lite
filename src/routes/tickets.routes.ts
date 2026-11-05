import { Router } from 'express';
import * as ticketsController from '../controllers/tickets.controller';
import * as commentsController from '../controllers/comments.controller';

const router = Router();

router.get('/', ticketsController.listTickets);
router.post('/', ticketsController.createTicket);
router.get('/:id', ticketsController.getTicket);
router.patch('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);

// Comments live under a ticket: /tickets/:id/comments
router.get('/:id/comments', commentsController.listComments);
router.post('/:id/comments', commentsController.createComment);

export default router;