import { Router } from 'express';
import { askAssistant } from '../controllers/assistant.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/ask', askAssistant);

export default router;
