import axios from 'axios';
import {
  User,
  LearnerProfile,
  CareerRecommendation,
  SkillGapAnalysis,
  Roadmap,
  UserProgress,
  DashboardData,
  AIMessage
} from '@/types';
import {
  mockUser,
  mockLearnerProfile,
  mockCareerRecommendations,
  mockSkillGapAnalysis,
  mockRoadmap,
  mockDashboardData,
  mockUserProgress,
  mockInitialMessages
} from './mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Attach JWT access token if present in memory/sessionStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper for unwrapping ApiResponse wrapper { statusCode, data, message, success }
function unwrapData<T>(responseData: any): T {
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data as T;
  }
  return responseData as T;
}

async function safeFetch<T>(apiCall: () => Promise<any>, fallback: T): Promise<T> {
  try {
    const response = await apiCall();
    return unwrapData<T>(response.data);
  } catch (error) {
    console.warn('[API Client] Server endpoint unreachable or returned error, falling back to mock dataset:', (error as Error).message);
    return fallback;
  }
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<User> {
    const res = await safeFetch<{ user: User }>(() => apiClient.get('/auth/me'), { user: mockUser });
    return res.user || mockUser;
  },

  async login(email: string, pass: string): Promise<{ user: User; accessToken?: string }> {
    try {
      const response = await apiClient.post('/auth/login', { email, password: pass });
      const data = unwrapData<{ user: User; accessToken?: string }>(response.data);
      if (data.accessToken && typeof window !== 'undefined') {
        sessionStorage.setItem('token', data.accessToken);
      }
      return data;
    } catch (error: any) {
      if (!error.response) {
        throw new Error('Unable to connect to authentication server. Please ensure the backend server is running.');
      }
      throw error;
    }
  },

  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; accessToken?: string }> {
    try {
      const response = await apiClient.post('/auth/register', data);
      const resData = unwrapData<{ user: User; accessToken?: string }>(response.data);
      if (resData.accessToken && typeof window !== 'undefined') {
        sessionStorage.setItem('token', resData.accessToken);
      }
      return resData;
    } catch (error: any) {
      if (!error.response) {
        throw new Error('Unable to connect to authentication server. Please ensure the backend server is running.');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
    }
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    }
  },

  async updateUser(data: { name?: string; avatar?: string }): Promise<User> {
    const res = await safeFetch<{ user: User } | User>(
      () => apiClient.patch('/auth/me', data),
      { ...mockUser, ...data }
    );
    return (res as any).user || res || { ...mockUser, ...data };
  },

  // Profile & Onboarding
  async getProfile(): Promise<LearnerProfile> {
    const res = await safeFetch<{ profile: LearnerProfile } | LearnerProfile>(() => apiClient.get('/profile'), mockLearnerProfile);
    return (res as any).profile || res || mockLearnerProfile;
  },

  async saveProfile(profile: Partial<LearnerProfile>): Promise<LearnerProfile> {
    const res = await safeFetch<{ profile: LearnerProfile } | LearnerProfile>(
      () => apiClient.post('/profile', profile),
      { ...mockLearnerProfile, ...profile }
    );
    return (res as any).profile || res || { ...mockLearnerProfile, ...profile };
  },

  // Recommendations
  async getRecommendations(): Promise<CareerRecommendation[]> {
    const res = await safeFetch<{ recommendations: CareerRecommendation[] } | CareerRecommendation[]>(
      () => apiClient.get('/recommendations'),
      mockCareerRecommendations
    );
    return (res as any).recommendations || res || mockCareerRecommendations;
  },

  async getRecommendationById(id: string): Promise<CareerRecommendation> {
    const res = await safeFetch<{ career: CareerRecommendation } | CareerRecommendation>(
      () => apiClient.get(`/recommendations/${id}`),
      mockCareerRecommendations.find(c => c.id === id) || mockCareerRecommendations[0]
    );
    return (res as any).career || res || mockCareerRecommendations[0];
  },

  async getSkillGap(careerId: string): Promise<SkillGapAnalysis> {
    const res = await safeFetch<{ skillGap: SkillGapAnalysis } | SkillGapAnalysis>(
      () => apiClient.post('/recommendations/skill-gap', { careerId }),
      mockSkillGapAnalysis
    );
    return (res as any).skillGap || res || mockSkillGapAnalysis;
  },

  // Roadmap
  async getRoadmap(): Promise<Roadmap> {
    const raw = await safeFetch<any>(() => apiClient.get('/roadmaps'), mockRoadmap);

    if (!raw) return mockRoadmap;

    // Backend returns IRoadmap[] (array) from GET /roadmaps — pick the first active one
    const rawRoadmap = Array.isArray(raw)
      ? (raw.find((r: any) => r.status === 'active') || raw[0])
      : ((raw as any).roadmap || raw);

    if (!rawRoadmap) return mockRoadmap;

    // Map backend IRoadmap → frontend Roadmap type
    const phases = Array.isArray(rawRoadmap.phases)
      ? rawRoadmap.phases.map((phase: any, phaseIdx: number) => {
          const milestones = Array.isArray(phase.milestones)
            ? phase.milestones.map((m: any) => ({
                id: m.milestoneId || m._id || m.id || `m_${phaseIdx}`,
                title: m.title || 'Untitled milestone',
                description: m.description || '',
                estimatedHours: m.estimatedHours ?? 10,
                completed: m.completed ?? false,
                resourceType: m.resources?.[0]?.type || 'Course',
                resourceUrl: m.resources?.[0]?.url || '#'
              }))
            : [];

          // Flatten all milestone resources into the phase resources array
          const resources = Array.isArray(phase.milestones)
            ? phase.milestones.flatMap((m: any) =>
                Array.isArray(m.resources)
                  ? m.resources.map((r: any, rIdx: number) => ({
                      id: `${m.milestoneId || phaseIdx}_res_${rIdx}`,
                      title: r.title || 'Resource',
                      type: r.type || 'Course',
                      duration: m.estimatedHours ? `${m.estimatedHours}h` : '–',
                      url: r.url || '#'
                    }))
                  : []
              )
            : [];

          const completedCount = milestones.filter((m: any) => m.completed).length;
          const isCompleted = milestones.length > 0 && completedCount === milestones.length;
          const isCurrent = !isCompleted && phaseIdx === rawRoadmap.phases.findIndex((p: any) =>
            Array.isArray(p.milestones) && p.milestones.some((m: any) => !m.completed)
          );

          return {
            id: phase.phaseId || phase._id || `phase_${phaseIdx}`,
            phaseNumber: phaseIdx + 1,
            title: phase.title || `Phase ${phaseIdx + 1}`,
            summary: phase.description || phase.summary || '',
            durationWeeks: phase.estimatedWeeks ?? phase.durationWeeks ?? 4,
            skillsCovered: Array.isArray(phase.skills) ? phase.skills
              : milestones.flatMap((m: any) => []).slice(0, 3), // fallback: empty
            milestones,
            resources,
            isCompleted,
            isCurrent,
            progressPercent: milestones.length > 0
              ? Math.round((completedCount / milestones.length) * 100)
              : 0
          };
        })
      : mockRoadmap.phases;

    return {
      id: rawRoadmap._id || rawRoadmap.id || mockRoadmap.id,
      userId: rawRoadmap.userId || mockRoadmap.userId,
      careerId: rawRoadmap.careerId || mockRoadmap.careerId,
      careerTitle: rawRoadmap.targetCareer || rawRoadmap.careerTitle || mockRoadmap.careerTitle,
      totalDurationMonths: rawRoadmap.estimatedMonths ?? rawRoadmap.totalDurationMonths ?? Math.ceil((rawRoadmap.estimatedHours || 200) / 40),
      weeklyCommitmentHours: rawRoadmap.weeklyCommitmentHours ?? rawRoadmap.weeklyHours ?? 10,
      overallCompletionPercent: rawRoadmap.overallCompletionPercent ?? (() => {
        const allMilestones = phases.flatMap((p: any) => p.milestones);
        return allMilestones.length > 0
          ? Math.round((allMilestones.filter((m: any) => m.completed).length / allMilestones.length) * 100)
          : 0;
      })(),
      currentPhaseNumber: rawRoadmap.currentPhaseNumber ?? 1,
      phases,
      adaptiveEvents: Array.isArray(rawRoadmap.adaptiveEvents) ? rawRoadmap.adaptiveEvents : [],
      updatedAt: rawRoadmap.updatedAt || new Date().toISOString()
    };
  },

  async generateRoadmap(careerId: string): Promise<Roadmap> {
    const res = await safeFetch<{ roadmap: Roadmap } | Roadmap>(
      () => apiClient.post('/roadmaps/generate', { careerId }),
      mockRoadmap
    );
    return (res as any).roadmap || res || mockRoadmap;
  },

  async toggleMilestone(phaseId: string, milestoneId: string): Promise<Roadmap> {
    const res = await safeFetch<{ roadmap: Roadmap } | Roadmap>(
      () => apiClient.patch(`/roadmaps/${mockRoadmap.id}`, { phaseId, milestoneId }),
      {
        ...mockRoadmap,
        overallCompletionPercent: Math.min(100, mockRoadmap.overallCompletionPercent + 5)
      }
    );
    return (res as any).roadmap || res || mockRoadmap;
  },

  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    const raw = await safeFetch<any>(
      () => apiClient.get('/dashboard'),
      mockDashboardData
    );

    if (!raw) return mockDashboardData;

    const user: User = {
      id: raw.user?.id || raw.user?._id || mockUser.id,
      name: raw.user?.name || mockUser.name,
      email: raw.user?.email || mockUser.email,
      avatar: raw.user?.avatar || mockUser.avatar,
      createdAt: raw.user?.createdAt || mockUser.createdAt
    };

    const activeGoal = {
      careerId: raw.activeGoal?.careerId || 'car_ai_eng',
      title: raw.activeGoal?.title || raw.careerGoal?.targetCareer || raw.targetCareer || 'AI Engineer',
      matchScore: raw.activeGoal?.matchScore ?? 87,
      estimatedMonths: raw.activeGoal?.estimatedMonths ?? 7
    };

    const currentProgress = {
      overallCompletionPercent: raw.currentProgress?.overallCompletionPercent ?? raw.progress?.overallCompletionPercent ?? 42,
      learningHours: raw.currentProgress?.learningHours ?? raw.progress?.totalLearningHours ?? 38.5,
      streakDays: raw.currentProgress?.streakDays ?? raw.progress?.streakDays ?? 6
    };

    const currentPhase = {
      phaseNumber: raw.currentPhase?.phaseNumber ?? 2,
      title: raw.currentPhase?.title || 'Mathematics & Statistics for AI',
      progressPercent: raw.currentPhase?.progressPercent ?? 75
    };

    const nextAction = {
      id: raw.nextAction?.id || 'm4',
      title: raw.nextAction?.title || (raw.nextActions?.[0]?.label ?? 'Complete: Linear Regression Basics'),
      phaseTitle: raw.nextAction?.phaseTitle || 'Phase 2: Mathematics & Statistics for AI',
      estimatedMinutes: raw.nextAction?.estimatedMinutes ?? 45,
      resourceType: raw.nextAction?.resourceType || 'Interactive Lab'
    };

    const skillGapSummary = {
      strong: raw.skillGapSummary?.strong ?? 3,
      needsWork: raw.skillGapSummary?.needsWork ?? 2,
      missing: raw.skillGapSummary?.missing ?? 3
    };

    const recommendedResources = raw.recommendedResources || mockDashboardData.recommendedResources;

    return {
      user,
      activeGoal,
      currentProgress,
      currentPhase,
      nextAction,
      skillGapSummary,
      recommendedResources
    };
  },

  // Progress
  async getProgress(): Promise<UserProgress> {
    const raw = await safeFetch<any>(
      () => apiClient.get('/progress/summary'),
      mockUserProgress
    );

    if (!raw) return mockUserProgress;

    // Backend returns { totalMilestones, completedMilestones, totalTimeSpentHours, overallPercentage, recentActivity, ... }
    // Normalize into UserProgress shape
    const recentActivity = Array.isArray(raw.recentActivity)
      ? raw.recentActivity.map((item: any, idx: number) => ({
          id: item._id || item.id || `act_${idx}`,
          title: item.milestoneId
            ? `Completed milestone ${item.milestoneId}`
            : item.notes || 'Learning activity recorded',
          type: item.status === 'completed' ? 'Milestone' : 'Progress',
          timestamp: item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
            : 'Recently'
        }))
      : mockUserProgress.recentActivity;

    return {
      id: raw._id || raw.id || mockUserProgress.id,
      userId: raw.userId || mockUserProgress.userId,
      totalLearningHours: raw.totalTimeSpentHours ?? raw.totalLearningHours ?? mockUserProgress.totalLearningHours,
      currentStreakDays: raw.streakDays ?? raw.currentStreakDays ?? mockUserProgress.currentStreakDays,
      completedMilestonesCount: raw.completedMilestones ?? raw.completedMilestonesCount ?? mockUserProgress.completedMilestonesCount,
      acquiredSkillsCount: raw.acquiredSkillsCount ?? mockUserProgress.acquiredSkillsCount,
      completedProjectsCount: raw.completedProjectsCount ?? mockUserProgress.completedProjectsCount,
      recentActivity
    };
  },

  // Assistant
  async sendAssistantMessage(content: string): Promise<AIMessage> {
    const fallbackResponse: AIMessage = {
      id: `msg_${Date.now() + 1}`,
      sender: 'assistant',
      content: `I've analyzed your request: **"${content}"**.\n\nAs an aspiring **AI Engineer**, here is my recommendation:\n- **Focus**: Finish your linear regression milestone in Phase 2.\n- **Action**: Try building a cost-function minimization script in Python.\n\nWould you like me to update your roadmap accordingly?`,
      timestamp: 'Just now',
      actionCard: {
        title: 'Recommended Practice Item',
        description: 'Linear Regression & Cost Function Lab',
        ctaText: 'Add to Roadmap',
        actionType: 'ADD_TO_ROADMAP'
      }
    };

    const res = await safeFetch<any>(
      () => apiClient.post('/conversation/message', { message: content }),
      fallbackResponse
    );

    if (!res) return fallbackResponse;

    const replyObj = res.reply || res.message || res;
    if (typeof replyObj === 'string') {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        content: replyObj,
        timestamp: 'Just now'
      };
    }

    return {
      id: replyObj._id || replyObj.id || `msg_${Date.now()}`,
      sender: replyObj.sender || 'assistant',
      content: replyObj.message || replyObj.content || 'Response received.',
      timestamp: replyObj.timestamp
        ? new Date(replyObj.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now',
      actionCard: replyObj.actionCard || (res === fallbackResponse ? fallbackResponse.actionCard : undefined)
    };
  },

  // Feedback
  async submitFeedback(data: { targetType: string; rating: 'positive' | 'negative'; comments?: string }): Promise<{ success: boolean }> {
    return safeFetch(
      () => apiClient.post('/feedback', data),
      { success: true }
    );
  }
};
