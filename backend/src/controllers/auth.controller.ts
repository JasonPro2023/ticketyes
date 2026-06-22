import { Request, Response } from 'express';
import { register, login } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validations/auth.schema';

export async function registerController(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      },
    });
    return;
  }

  try {
    const authResponse = await register(result.data);
    res.status(201).json(authResponse);
  } catch (error) {
    throw error;
  }
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      },
    });
    return;
  }

  try {
    const authResponse = await login(result.data);
    res.status(200).json(authResponse);
  } catch (error) {
    throw error;
  }
}
