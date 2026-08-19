import { Router } from 'express';
import { register, login, logout, refresh, getMe, updateMe } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
