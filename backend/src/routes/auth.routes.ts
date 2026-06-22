import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth.controller';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

router.post('/auth/register', registerController);
router.post('/auth/login', loginController);

// Protected route example: get current user profile
router.get('/auth/me', authenticate, async (req: AuthRequest, res) => {
  const { prisma } = await import('../config/database');
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: { message: 'User not found' } });
    return;
  }

  res.json({ user });
});

export default router;
