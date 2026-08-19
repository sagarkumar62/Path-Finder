import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getDashboardData);

export default router;
