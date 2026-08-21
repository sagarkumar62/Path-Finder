import { Response, NextFunction } from 'express';
import { conversationService } from '../services/conversation.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getUserConversations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const conversations = await conversationService.getUserConversations(userId);
    res.status(200).json(new ApiResponse(200, conversations, 'Conversations retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    const conversation = await conversationService.getConversationById(id, userId);
    res.status(200).json(new ApiResponse(200, conversation, 'Conversation retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { initialMessage } = req.body || {};
    const conversation = await conversationService.createConversation(userId, initialMessage);
    res.status(201).json(new ApiResponse(201, conversation, 'Conversation created successfully'));
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { message, conversationId, context, stream } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message content is required' });
      return;
    }

    const isStreamRequested =
      stream === true ||
      req.headers.accept?.includes('text/event-stream');

    if (isStreamRequested) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await conversationService.sendMessageStream(
        userId,
        conversationId,
        message,
        (data) => {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        },
        context
      );

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await conversationService.sendMessage(userId, conversationId, message, context);
    res.status(200).json(new ApiResponse(200, result, 'Message processed successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    await conversationService.deleteConversation(id, userId);
    res.status(200).json(new ApiResponse(200, { id }, 'Conversation deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Backward compatibility alias for GET /
export const getConversation = getUserConversations;
