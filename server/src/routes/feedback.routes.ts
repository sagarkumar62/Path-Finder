import { Router } from 'express';
import { createFeedback, getFeedback } from '../controllers/feedback.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { feedbackSchema } from '../validators/feedback.validator';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(feedbackSchema), createFeedback);
router.get('/', getFeedback);

export default router;
