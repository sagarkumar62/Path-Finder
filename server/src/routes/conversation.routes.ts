import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/conversation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/message', sendMessage);
router.get('/', getConversation);

export default router;
