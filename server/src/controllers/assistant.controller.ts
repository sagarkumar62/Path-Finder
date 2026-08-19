import { Response, NextFunction } from 'express';
import { conversationService } from '../services/conversation.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const askAssistant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { message, context } = req.body;
    const result = await conversationService.sendMessage(userId, message || 'How do I start?', context);
    res.status(200).json(new ApiResponse(200, result, 'Assistant query handled successfully'));
  } catch (error) {
    next(error);
  }
};
