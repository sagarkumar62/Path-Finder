import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface PythonRecommendationResponse {
  success: boolean;
  recommendations: Array<{
    career_id: string;
    career: string;
    match_score: number;
    score_breakdown: {
      skill_match: number;
      interest_match: number;
      goal_match: number;
      experience_match: number;
      education_match: number;
      semantic_similarity: number;
    };
    strengths: string[];
    skill_gaps: string[];
    confidence: number;
  }>;
}

export interface PythonRoadmapResponse {
  success: boolean;
  careerId: string;
  careerTitle: string;
  matchScore: number;
  duration: number;
  durationUnit: string;
  estimatedHours: number;
  strengths: string[];
  missingSkills: string[];
  needsWorkSkills: string[];
  phases: Array<{
    phaseId: string;
    title: string;
    description: string;
    skills: string[];
    prerequisites: string[];
    progressPercent: number;
    milestones: Array<{
      milestoneId: string;
      title: string;
      description: string;
      estimatedHours: number;
      completed: boolean;
      targetSkill: string;
    }>;
  }>;
}

export class PythonAIService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = env.AI_SERVICE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL,
      timeout: env.AI_SERVICE_TIMEOUT || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getRecommendations(profile: Record<string, any>): Promise<PythonRecommendationResponse> {
    try {
      const response = await this.client.post('/recommend', {
        user_id: profile.userId || profile._id || 'user',
        profile,
      });
      return response.data;
    } catch (error: any) {
      logger.warn(`[PythonAIService] /recommend call failed: ${error.message}`);
      throw new Error('Career intelligence service is temporarily unavailable.');
    }
  }

  async generateRoadmapStructure(profile: Record<string, any>, targetCareer: string): Promise<PythonRoadmapResponse> {
    try {
      const response = await this.client.post('/roadmap/generate', {
        user_id: profile.userId || profile._id || 'user',
        target_career: targetCareer,
        profile,
      });
      return response.data;
    } catch (error: any) {
      logger.warn(`[PythonAIService] /roadmap/generate call failed: ${error.message}`);
      throw new Error('Career intelligence service is temporarily unavailable.');
    }
  }
}

export const pythonAIService = new PythonAIService();
