import axios, { AxiosInstance } from 'axios';
import { aiConfig } from '../config/ai';
import { logger } from '../utils/logger';

export interface AIRecommendationRequest {
  userId: string;
  profile: Record<string, any>;
}

export interface AISkillGapRequest {
  userId: string;
  profile: Record<string, any>;
  career: string;
}

export interface AIRoadmapRequest {
  userId: string;
  profile: Record<string, any>;
  targetCareer: string;
  skillGap?: Record<string, any>;
}

export interface AIAdaptRequest {
  userId: string;
  profile: Record<string, any>;
  currentRoadmap?: Record<string, any>;
  progress?: Record<string, any>;
  feedback?: Record<string, any>;
}

export interface AIAssistantRequest {
  userId: string;
  message: string;
  context?: Record<string, any>;
}

export class AIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: aiConfig.baseUrl,
      timeout: aiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getRecommendations(data: AIRecommendationRequest) {
    if (aiConfig.mockMode) {
      logger.info(`[AIService] Returning MOCK career recommendations for user: ${data.userId}`);
      return this.getMockRecommendations(data);
    }

    try {
      const response = await this.client.post(aiConfig.endpoints.recommend, data);
      this.validateRecommendationResponse(response.data);
      return response.data;
    } catch (error: any) {
      logger.warn(`[AIService] FastAPI error on /recommend. Falling back to MOCK mode. Reason: ${error.message}`);
      return this.getMockRecommendations(data);
    }
  }

  async getSkillGap(data: AISkillGapRequest) {
    if (aiConfig.mockMode) {
      logger.info(`[AIService] Returning MOCK skill gap analysis for career: ${data.career}`);
      return this.getMockSkillGap(data);
    }

    try {
      const response = await this.client.post(aiConfig.endpoints.skillGap, data);
      return response.data;
    } catch (error: any) {
      logger.warn(`[AIService] FastAPI error on /skill-gap. Falling back to MOCK mode. Reason: ${error.message}`);
      return this.getMockSkillGap(data);
    }
  }

  async generateRoadmap(data: AIRoadmapRequest) {
    if (aiConfig.mockMode) {
      logger.info(`[AIService] Generating MOCK roadmap for target career: ${data.targetCareer}`);
      return this.getMockRoadmap(data);
    }

    try {
      const response = await this.client.post(aiConfig.endpoints.roadmap, data);
      return response.data;
    } catch (error: any) {
      logger.warn(`[AIService] FastAPI error on /roadmap. Falling back to MOCK mode. Reason: ${error.message}`);
      return this.getMockRoadmap(data);
    }
  }

  async adaptRoadmap(data: AIAdaptRequest) {
    if (aiConfig.mockMode) {
      logger.info(`[AIService] Returning MOCK adaptive roadmap for user: ${data.userId}`);
      return this.getMockAdaptiveResponse(data);
    }

    try {
      const response = await this.client.post(aiConfig.endpoints.adapt, data);
      return response.data;
    } catch (error: any) {
      logger.warn(`[AIService] FastAPI error on /adapt. Falling back to MOCK mode. Reason: ${error.message}`);
      return this.getMockAdaptiveResponse(data);
    }
  }

  async generateAssistantResponse(data: AIAssistantRequest) {
    if (aiConfig.mockMode) {
      logger.info(`[AIService] Returning MOCK assistant response for query: "${data.message}"`);
      return this.getMockAssistantResponse(data);
    }

    try {
      const response = await this.client.post(aiConfig.endpoints.assistant, data);
      return response.data;
    } catch (error: any) {
      logger.warn(`[AIService] FastAPI error on /assistant. Falling back to MOCK mode. Reason: ${error.message}`);
      return this.getMockAssistantResponse(data);
    }
  }

  private validateRecommendationResponse(data: any) {
    if (!data || !Array.isArray(data.recommendations)) {
      throw new Error('Malformed AI recommendation response: missing recommendations array');
    }
  }

  // MOCK DATA GENERATORS
  private getMockRecommendations(data: AIRecommendationRequest) {
    const target = data.profile?.targetCareer || 'AI Engineer';
    const userSkills: string[] = data.profile?.skills || ['JavaScript', 'React'];

    return {
      recommendations: [
        {
          career: target,
          matchScore: 0.88,
          confidence: 0.92,
          reasons: [
            `Existing experience in ${userSkills.slice(0, 2).join(' & ') || 'software fundamentals'} provides a solid baseline.`,
            `High alignment with stated goals for ${target}.`,
            'Strong job market growth and industry demand.',
          ],
          skillGaps: ['Python', 'Machine Learning', 'PyTorch', 'Statistics & Math'],
        },
        {
          career: 'Full Stack Developer',
          matchScore: 0.82,
          confidence: 0.89,
          reasons: [
            'Direct alignment with web development technologies.',
            'High demand across startups and enterprise software.',
          ],
          skillGaps: ['Node.js', 'Express.js', 'MongoDB', 'Docker'],
        },
        {
          career: 'Data Scientist',
          matchScore: 0.75,
          confidence: 0.84,
          reasons: [
            'Strong analytical requirement matching problem-solving skills.',
          ],
          skillGaps: ['Python', 'SQL / PostgreSQL', 'Statistics & Math', 'Data Visualization'],
        },
      ],
    };
  }

  private getMockSkillGap(data: AISkillGapRequest) {
    const userSkills: string[] = data.profile?.skills || ['JavaScript', 'React'];
    const career = data.career || 'AI Engineer';

    return {
      career,
      currentSkills: userSkills,
      missingSkills: ['Python', 'Machine Learning', 'PyTorch', 'Statistics & Math', 'SQL / PostgreSQL'],
      skillsToImprove: userSkills,
      priority: ['Python', 'Machine Learning', 'Statistics & Math', 'PyTorch', 'SQL / PostgreSQL'],
    };
  }

  private getMockRoadmap(data: AIRoadmapRequest) {
    const career = data.targetCareer || 'AI Engineer';

    return {
      title: `${career} Master Pathway`,
      targetCareer: career,
      duration: '8 Months',
      estimatedHours: 320,
      prerequisites: ['Basic Computer Literacy', 'High School Math'],
      phases: [
        {
          phaseId: 'phase-1',
          title: 'Phase 1: Programming & Math Fundamentals',
          description: 'Build a rock-solid foundation in Python programming, linear algebra, and data manipulation.',
          estimatedWeeks: 6,
          milestones: [
            {
              milestoneId: 'm1-1',
              title: 'Python Core Syntax & Data Structures',
              description: 'Master variables, loops, data structures, and functions in Python.',
              estimatedHours: 20,
              resources: [
                { title: 'Python for Data Science & AI', type: 'Course', url: 'https://coursera.org', isFree: true },
              ],
              skills: ['Python'],
              order: 1,
            },
            {
              milestoneId: 'm1-2',
              title: 'Linear Algebra & Statistics Basics',
              description: 'Understand matrix operations, vectors, probability distributions, and hypothesis testing.',
              estimatedHours: 25,
              resources: [
                { title: 'Statistics for Data Science', type: 'Course', url: 'https://khanacademy.org', isFree: true },
              ],
              skills: ['Statistics & Math'],
              order: 2,
            },
          ],
        },
        {
          phaseId: 'phase-2',
          title: 'Phase 2: Machine Learning Core',
          description: 'Learn supervised and unsupervised learning algorithms, feature engineering, and model evaluation.',
          estimatedWeeks: 8,
          milestones: [
            {
              milestoneId: 'm2-1',
              title: 'Scikit-Learn & Regression Models',
              description: 'Train linear regression, logistic regression, and decision tree models.',
              estimatedHours: 30,
              resources: [
                { title: 'Scikit-Learn Official Tutorials', type: 'Article', url: 'https://scikit-learn.org', isFree: true },
              ],
              skills: ['Machine Learning'],
              order: 1,
            },
          ],
        },
        {
          phaseId: 'phase-3',
          title: 'Phase 3: Deep Learning & Neural Networks',
          description: 'Construct neural networks, CNNs, RNNs, and Transformers using PyTorch.',
          estimatedWeeks: 8,
          milestones: [
            {
              milestoneId: 'm3-1',
              title: 'PyTorch Deep Learning Pipeline',
              description: 'Build custom datasets, dataloaders, and train neural net architectures.',
              estimatedHours: 40,
              resources: [
                { title: 'PyTorch Official Fundamentals Tutorials', type: 'Interactive', url: 'https://pytorch.org', isFree: true },
              ],
              skills: ['PyTorch', 'Deep Learning'],
              order: 1,
            },
          ],
        },
        {
          phaseId: 'phase-4',
          title: 'Phase 4: Capstone AI Deployment',
          description: 'Deploy an AI model as an interactive API web application.',
          estimatedWeeks: 4,
          milestones: [
            {
              milestoneId: 'm4-1',
              title: 'RAG-Based AI Assistant Capstone',
              description: 'Construct a full-stack RAG web application serving LLM predictions.',
              estimatedHours: 50,
              resources: [
                { title: 'FastAPI Microservice Guide', type: 'Article', url: 'https://fastapi.tiangolo.com', isFree: true },
              ],
              skills: ['REST & GraphQL APIs', 'Docker'],
              order: 1,
            },
          ],
        },
      ],
    };
  }

  private getMockAdaptiveResponse(data: AIAdaptRequest) {
    return {
      explanation: 'Adapted learning path based on completion rate and learner feedback. Prioritized hands-on projects.',
      recommendedAdjustments: [
        'Accelerated Phase 1 syntax module due to prior coding experience.',
        'Added hands-on PyTorch coding labs based on positive feedback.',
      ],
      updatedRoadmap: this.getMockRoadmap({
        userId: data.userId,
        profile: data.profile,
        targetCareer: data.profile?.targetCareer || 'AI Engineer',
      }),
    };
  }

  private getMockAssistantResponse(data: AIAssistantRequest) {
    const msg = data.message.toLowerCase();
    let answer = `Great question! To excel in your career journey toward ${data.context?.currentCareer || 'your goal'}, focus on practical project building alongside foundational theory.`;

    if (msg.includes('python') || msg.includes('javascript') || msg.includes('next')) {
      answer = `Since you asked about programming languages: Python is essential for AI, Data Science, and Machine Learning, while JavaScript/TypeScript is standard for Full Stack and Frontend web development. I recommend dedicating 10-15 hours weekly to building small end-to-end projects.`;
    } else if (msg.includes('roadmap') || msg.includes('start') || msg.includes('begin')) {
      answer = `To begin effectively: 1) Complete your Learner Profile, 2) Review your personalized Skill Gap analysis, 3) Follow your generated 4-Phase Roadmap milestone by milestone!`;
    }

    return {
      answer,
      suggestedActions: [
        'Explore recommended courses in Phase 1',
        'Run Skill-Gap analysis for target career',
        'Track weekly learning progress',
      ],
      relatedSkills: ['Python', 'Machine Learning', 'TypeScript', 'Node.js'],
    };
  }
}

export const aiService = new AIService();
