import { Response, NextFunction } from 'express';
import { feedbackService } from '../services/feedback.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createFeedback = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const feedback = await feedbackService.submitFeedback(userId, req.body);
    res.status(201).json(new ApiResponse(201, feedback, 'Feedback submitted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const feedbacks = await feedbackService.getUserFeedback(userId);
    res.status(200).json(new ApiResponse(200, feedbacks, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
