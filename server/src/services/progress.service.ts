import { Progress, IProgress } from '../models/Progress';
import { Roadmap } from '../models/Roadmap';
import { ApiError } from '../utils/ApiError';

export interface ProgressUpdateInput {
  status?: 'not_started' | 'in_progress' | 'completed';
  completionPercentage?: number;
  timeSpent?: number;
  notes?: string;
}

export class ProgressService {
  async getProgressByUserId(userId: string, roadmapId?: string): Promise<IProgress[]> {
    const filter: any = { userId };
    if (roadmapId) {
      filter.roadmapId = roadmapId;
    }
    return Progress.find(filter).sort({ updatedAt: -1 });
  }

  async updateProgress(
    userId: string,
    progressIdOrMilestoneId: string,
    data: ProgressUpdateInput
  ): Promise<IProgress> {
    let progress = await Progress.findOne({
      userId,
      $or: [{ _id: progressIdOrMilestoneId }, { milestoneId: progressIdOrMilestoneId }],
    });

    if (!progress) {
      throw ApiError.notFound('Progress record for this milestone was not found.');
    }

    if (data.status) progress.status = data.status;
    if (data.completionPercentage !== undefined) progress.completionPercentage = data.completionPercentage;
    if (data.timeSpent !== undefined) progress.timeSpent += data.timeSpent;
    if (data.notes !== undefined) progress.notes = data.notes;

    if (data.status === 'in_progress' && !progress.startedAt) {
      progress.startedAt = new Date();
    }

    if (data.status === 'completed') {
      progress.completionPercentage = 100;
      if (!progress.completedAt) {
        progress.completedAt = new Date();
      }
    }

    await progress.save();
    return progress;
  }

  async createProgressItem(userId: string, roadmapId: string, phaseId: string, milestoneId: string): Promise<IProgress> {
    const existing = await Progress.findOne({ userId, roadmapId, milestoneId });
    if (existing) return existing;

    return Progress.create({
      userId,
      roadmapId,
      phaseId,
      milestoneId,
      status: 'not_started',
      completionPercentage: 0,
      timeSpent: 0,
    });
  }

  async getProgressSummary(userId: string) {
    const activeRoadmap = await Roadmap.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });

    let roadmapId = activeRoadmap?._id;
    const progressList = roadmapId ? await Progress.find({ userId, roadmapId }) : await Progress.find({ userId });

    const totalMilestones = progressList.length;
    const completedMilestones = progressList.filter((p) => p.status === 'completed').length;
    const inProgressMilestones = progressList.filter((p) => p.status === 'in_progress').length;
    const totalTimeSpent = progressList.reduce((acc, p) => acc + (p.timeSpent || 0), 0);

    const overallPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return {
      activeRoadmapId: roadmapId || null,
      activeRoadmapTitle: activeRoadmap?.title || null,
      targetCareer: activeRoadmap?.targetCareer || null,
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      remainingMilestones: totalMilestones - completedMilestones,
      totalTimeSpentHours: totalTimeSpent,
      overallPercentage,
      recentActivity: progressList.slice(0, 5),
    };
  }
}

export const progressService = new ProgressService();
