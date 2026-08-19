import { Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const roadmapId = req.query.roadmapId as string;
    const progressList = await progressService.getProgressByUserId(userId, roadmapId);
    res.status(200).json(new ApiResponse(200, progressList, 'Progress records retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { roadmapId, phaseId, milestoneId } = req.body;
    const progress = await progressService.createProgressItem(userId, roadmapId, phaseId, milestoneId);
    res.status(201).json(new ApiResponse(201, progress, 'Progress record created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    const updated = await progressService.updateProgress(userId, id, req.body);
    res.status(200).json(new ApiResponse(200, updated, 'Progress updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getProgressSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const summary = await progressService.getProgressSummary(userId);
    res.status(200).json(new ApiResponse(200, summary, 'Progress summary retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
