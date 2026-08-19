import { Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendation.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createRecommendation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { targetCareer } = req.body;
    const result = await recommendationService.generateRecommendations(userId, targetCareer);
    res.status(200).json(new ApiResponse(200, result, 'Career recommendations generated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const results = await recommendationService.getUserRecommendations(userId);
    res.status(200).json(new ApiResponse(200, results, 'Recommendations retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getRecommendationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const id = req.params.id as string;
    const result = await recommendationService.getRecommendationById(id, userId);
    res.status(200).json(new ApiResponse(200, result, 'Recommendation retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const analyzeSkillGap = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { targetCareer } = req.body;
    const result = await recommendationService.getSkillGapAnalysis(userId, targetCareer);
    res.status(200).json(new ApiResponse(200, result, 'Skill gap analysis generated successfully'));
  } catch (error) {
    next(error);
  }
};

export const adaptRecommendation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { roadmapId } = req.body;
    const result = await recommendationService.adaptRecommendations(userId, roadmapId);
    res.status(200).json(new ApiResponse(200, result, 'Adaptive recommendations updated successfully'));
  } catch (error) {
    next(error);
  }
};
