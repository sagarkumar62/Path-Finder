import { Router } from 'express';
import {
  getUserConversations,
  getConversationById,
  createConversation,
  sendMessage,
  deleteConversation,
} from '../controllers/conversation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getUserConversations);
router.get('/:id', getConversationById);
router.post('/', createConversation);
router.post('/message', sendMessage);
router.delete('/:id', deleteConversation);

export default router;
