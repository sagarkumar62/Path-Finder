import { Response, NextFunction } from 'express';
import { conversationService } from '../services/conversation.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { message, context } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }
    const result = await conversationService.sendMessage(userId, message, context);
    res.status(200).json(new ApiResponse(200, result, 'Message processed successfully'));
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const conversation = await conversationService.getConversation(userId);
    res.status(200).json(new ApiResponse(200, conversation, 'Conversation retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
