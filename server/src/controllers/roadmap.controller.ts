import { Response, NextFunction } from 'express';
import { roadmapService } from '../services/roadmap.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const generateRoadmap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { targetCareer } = req.body;
    const roadmap = await roadmapService.generateRoadmap(userId, targetCareer);
    res.status(201).json(new ApiResponse(201, roadmap, 'Learning roadmap generated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getRoadmaps = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const roadmaps = await roadmapService.getUserRoadmaps(userId);
    res.status(200).json(new ApiResponse(200, roadmaps, 'Roadmaps retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getRoadmapById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    const roadmap = await roadmapService.getRoadmapById(id, userId);
    res.status(200).json(new ApiResponse(200, roadmap, 'Roadmap retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateRoadmap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    const { status } = req.body;
    const updated = await roadmapService.updateRoadmapStatus(id, userId, status);
    res.status(200).json(new ApiResponse(200, updated, 'Roadmap updated successfully'));
  } catch (error) {
    next(error);
  }
};
