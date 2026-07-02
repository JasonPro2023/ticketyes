import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  updateTicketController,
  deleteTicketController,
  getTicketStatsController,
} from '../controllers/ticket.controller';

const router = Router();

router.use(authenticate);

router.get('/tickets/stats', getTicketStatsController);
router.get('/tickets', getTicketsController);
router.get('/tickets/:id', getTicketByIdController);
router.post('/tickets', createTicketController);
router.put('/tickets/:id', updateTicketController);
router.patch('/tickets/:id', updateTicketController);
router.delete('/tickets/:id', deleteTicketController);

export default router;
