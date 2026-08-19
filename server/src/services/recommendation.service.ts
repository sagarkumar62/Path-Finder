import { Recommendation, IRecommendation } from '../models/Recommendation';
import { LearnerProfile } from '../models/LearnerProfile';
import { Career } from '../models/Career';
import { aiService } from './ai.service';
import { ApiError } from '../utils/ApiError';

export class RecommendationService {
  async generateRecommendations(userId: string, targetCareerInput?: string): Promise<IRecommendation> {
    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      throw ApiError.badRequest('Learner profile is required to generate career recommendations.');
    }

    const targetCareer = targetCareerInput || profile.targetCareer || 'AI Engineer';

    const aiResult = await aiService.getRecommendations({
      userId,
      profile: profile.toObject(),
    });

    if (!aiResult || !Array.isArray(aiResult.recommendations)) {
      throw ApiError.internal('Invalid response returned by recommendation engine.');
    }

    // Enrich recommendations with Career database IDs if available
    const enrichedRecommendations = await Promise.all(
      aiResult.recommendations.map(async (item: any) => {
        const careerDoc = await Career.findOne({
          title: { $regex: new RegExp(`^${item.career}$`, 'i') },
        });
        return {
          careerId: careerDoc?._id,
          career: item.career,
          matchScore: item.matchScore ?? 0.8,
          confidence: item.confidence ?? 0.85,
          reasons: item.reasons || [],
          skillGaps: item.skillGaps || [],
        };
      })
    );

    const recommendation = await Recommendation.create({
      userId,
      targetCareer,
      recommendations: enrichedRecommendations,
    });

    return recommendation;
  }

  async getSkillGapAnalysis(userId: string, targetCareerInput?: string) {
    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      throw ApiError.badRequest('Learner profile required for skill gap analysis.');
    }

    const careerTitle = targetCareerInput || profile.targetCareer || 'AI Engineer';

    const careerDoc = await Career.findOne({
      title: { $regex: new RegExp(`^${careerTitle}$`, 'i') },
    });

    const aiSkillGap = await aiService.getSkillGap({
      userId,
      profile: profile.toObject(),
      career: careerTitle,
    });

    return {
      career: careerTitle,
      careerDetails: careerDoc || null,
      currentSkills: aiSkillGap.currentSkills || profile.skills,
      missingSkills: aiSkillGap.missingSkills || [],
      skillsToImprove: aiSkillGap.skillsToImprove || [],
      priority: aiSkillGap.priority || [],
    };
  }

  async adaptRecommendations(userId: string, targetRoadmapId?: string) {
    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      throw ApiError.badRequest('Learner profile is required to adapt recommendations.');
    }

    const aiAdaptResult = await aiService.adaptRoadmap({
      userId,
      profile: profile.toObject(),
    });

    return aiAdaptResult;
  }

  async getUserRecommendations(userId: string): Promise<IRecommendation[]> {
    return Recommendation.find({ userId }).sort({ createdAt: -1 }).limit(10);
  }

  async getRecommendationById(id: string, userId: string): Promise<IRecommendation> {
    const rec = await Recommendation.findOne({ _id: id, userId });
    if (!rec) {
      throw ApiError.notFound('Recommendation record not found.');
    }
    return rec;
  }
}

export const recommendationService = new RecommendationService();
