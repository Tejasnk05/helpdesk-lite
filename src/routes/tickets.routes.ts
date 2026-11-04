import { Router } from 'express';
import * as ticketsController from '../controllers/tickets.controller';

const router = Router();

router.get('/', ticketsController.listTickets);
router.post('/', ticketsController.createTicket);
router.get('/:id', ticketsController.getTicket);
router.patch('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);

export default router;