import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { LearnerProfile } from '../models/LearnerProfile';
import { Recommendation } from '../models/Recommendation';
import { Roadmap } from '../models/Roadmap';
import { Progress } from '../models/Progress';
import { recommendationService } from '../services/recommendation.service';
import { progressService } from '../services/progress.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getDashboardData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Parallel aggregated queries
    const [userDoc, profileDoc, latestRecommendationDoc, activeRoadmapDoc, progressSummary] =
      await Promise.all([
        User.findById(userId).select('-password').lean(),
        LearnerProfile.findOne({ userId }).lean(),
        Recommendation.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        Roadmap.findOne({ userId, status: 'active' }).sort({ createdAt: -1 }).lean(),
        progressService.getProgressSummary(userId),
      ]);

    const targetCareer = profileDoc?.targetCareer || activeRoadmapDoc?.targetCareer || 'AI Engineer';

    // Skill gap analysis
    let skillGapData = null;
    try {
      skillGapData = await recommendationService.getSkillGapAnalysis(userId, targetCareer);
    } catch (err) {
      skillGapData = {
        career: targetCareer,
        currentSkills: profileDoc?.skills || [],
        missingSkills: [],
        skillsToImprove: [],
        priority: [],
      };
    }

    // Determine next actions for user
    const nextActions = [];
    if (!profileDoc?.targetCareer) {
      nextActions.push({ action: 'SET_TARGET_CAREER', label: 'Define your target career in your profile' });
    }
    if (!latestRecommendationDoc) {
      nextActions.push({ action: 'GENERATE_RECOMMENDATIONS', label: 'Get personalized AI career recommendations' });
    }
    if (!activeRoadmapDoc) {
      nextActions.push({ action: 'GENERATE_ROADMAP', label: 'Generate your step-by-step learning roadmap' });
    }
    if (progressSummary.remainingMilestones > 0) {
      nextActions.push({ action: 'CONTINUE_MILESTONE', label: 'Complete your next pending learning milestone' });
    }

    const payload = {
      user: userDoc,
      careerGoal: {
        targetCareer,
        experienceLevel: profileDoc?.experienceLevel || 'Beginner',
        weeklyLearningHours: profileDoc?.weeklyLearningHours || 10,
        careerGoals: profileDoc?.careerGoals || [],
      },
      topRecommendations: latestRecommendationDoc?.recommendations || [],
      skillGap: skillGapData,
      roadmap: activeRoadmapDoc || null,
      progress: progressSummary,
      nextActions,
      recentActivity: progressSummary.recentActivity || [],
    };

    res.status(200).json(new ApiResponse(200, payload, 'Dashboard data aggregated successfully'));
  } catch (error) {
    next(error);
  }
};
