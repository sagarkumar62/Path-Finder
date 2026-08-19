import { Roadmap, IRoadmap } from '../models/Roadmap';
import { Progress } from '../models/Progress';
import { LearnerProfile } from '../models/LearnerProfile';
import { aiService } from './ai.service';
import { recommendationService } from './recommendation.service';
import { ApiError } from '../utils/ApiError';

export class RoadmapService {
  async generateRoadmap(userId: string, targetCareerInput?: string): Promise<IRoadmap> {
    const profile = await LearnerProfile.findOne({ userId });
    if (!profile) {
      throw ApiError.badRequest('Learner profile is required to generate a learning roadmap.');
    }

    const targetCareer = targetCareerInput || profile.targetCareer || 'AI Engineer';

    // Skill gap context
    const skillGap = await recommendationService.getSkillGapAnalysis(userId, targetCareer);

    // Call AI Service
    const aiRoadmap = await aiService.generateRoadmap({
      userId,
      profile: profile.toObject(),
      targetCareer,
      skillGap,
    });

    // Deactivate previous active roadmaps for this target career
    await Roadmap.updateMany(
      { userId, targetCareer, status: 'active' },
      { $set: { status: 'archived' } }
    );

    // Create new Roadmap
    const roadmap = await Roadmap.create({
      userId,
      title: aiRoadmap.title || `${targetCareer} Learning Roadmap`,
      targetCareer,
      duration: aiRoadmap.duration || '6 Months',
      estimatedHours: aiRoadmap.estimatedHours || 200,
      prerequisites: aiRoadmap.prerequisites || [],
      phases: aiRoadmap.phases || [],
      status: 'active',
    });

    // Auto-create initial Progress documents for milestones
    if (roadmap.phases && Array.isArray(roadmap.phases)) {
      const progressDocs = [];
      for (const phase of roadmap.phases) {
        if (phase.milestones && Array.isArray(phase.milestones)) {
          for (const milestone of phase.milestones) {
            progressDocs.push({
              userId,
              roadmapId: roadmap._id,
              phaseId: phase.phaseId,
              milestoneId: milestone.milestoneId,
              status: 'not_started',
              completionPercentage: 0,
              timeSpent: 0,
            });
          }
        }
      }
      if (progressDocs.length > 0) {
        await Progress.insertMany(progressDocs);
      }
    }

    return roadmap;
  }

  async getUserRoadmaps(userId: string): Promise<IRoadmap[]> {
    return Roadmap.find({ userId }).sort({ createdAt: -1 });
  }

  async getRoadmapById(id: string, userId: string): Promise<IRoadmap> {
    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      throw ApiError.notFound('Roadmap not found.');
    }
    return roadmap;
  }

  async updateRoadmapStatus(id: string, userId: string, status: 'active' | 'completed' | 'archived'): Promise<IRoadmap> {
    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      throw ApiError.notFound('Roadmap not found.');
    }
    roadmap.status = status;
    await roadmap.save();
    return roadmap;
  }
}

export const roadmapService = new RoadmapService();
