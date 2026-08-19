import { Router } from 'express';
import {
  getProgress,
  createProgress,
  updateProgress,
  getProgressSummary,
} from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProgress);
router.post('/', createProgress);
router.patch('/:id', updateProgress);
router.get('/summary', getProgressSummary);

export default router;
