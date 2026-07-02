import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';

const router = Router();

router.get('/health', healthController);
router.use(authRoutes);
router.use(ticketRoutes);

export default router;
