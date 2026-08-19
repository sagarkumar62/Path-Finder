export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  name: string;
  category?: 'programming' | 'framework' | 'tool' | 'soft' | 'domain';
  proficiency: SkillProficiency;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface LearnerProfile {
  id: string;
  userId: string;
  skills: Skill[];
  interests: string[];
  education: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  targetCareerGoal?: string;
  goalReason?: string;
  learningPreferences: {
    formats: ('Videos' | 'Reading' | 'Projects' | 'Interactive' | 'Courses' | 'Docs')[];
    weeklyHours: number;
  };
  updatedAt: string;
}

export interface SkillGapItem {
  skillName: string;
  currentProficiency: SkillProficiency | 'None';
  requiredProficiency: SkillProficiency;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Strong' | 'Needs Improvement' | 'Missing';
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number;
  difficulty: 'Entry' | 'Intermediate' | 'Advanced';
  estimatedTransition: string;
  description: string;
  whyMatches: string[];
  skillGaps: string[];
  keyResponsibilities: string[];
  averageSalary?: string;
}

export interface SkillGapAnalysis {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  items: SkillGapItem[];
  strongCount: number;
  improvementCount: number;
  missingCount: number;
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'Course' | 'Project' | 'Docs' | 'Interactive';
  url: string;
  duration: string;
  completed?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  skillsCovered: string[];
  summary: string;
  resources: RoadmapResource[];
  milestones: Milestone[];
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface AdaptiveEvent {
  date: string;
  reason: string;
  adjustment: string;
  previousDurationWeeks: number;
  newDurationWeeks: number;
}

export interface Roadmap {
  id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  totalDurationMonths: number;
  weeklyCommitmentHours: number;
  overallCompletionPercent: number;
  currentPhaseNumber: number;
  phases: RoadmapPhase[];
  adaptiveEvents?: AdaptiveEvent[];
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  totalLearningHours: number;
  currentStreakDays: number;
  completedMilestonesCount: number;
  acquiredSkillsCount: number;
  completedProjectsCount: number;
  recentActivity: {
    id: string;
    title: string;
    type: string;
    timestamp: string;
  }[];
}

export interface DashboardData {
  user: User;
  activeGoal: {
    careerId: string;
    title: string;
    matchScore: number;
    estimatedMonths: number;
  };
  currentProgress: {
    overallCompletionPercent: number;
    learningHours: number;
    streakDays: number;
  };
  currentPhase: {
    phaseNumber: number;
    title: string;
    progressPercent: number;
  };
  nextAction: {
    id: string;
    title: string;
    phaseTitle: string;
    estimatedMinutes: number;
    resourceType: string;
  };
  skillGapSummary: {
    strong: number;
    needsWork: number;
    missing: number;
  };
  recommendedResources: {
    id: string;
    title: string;
    type: 'Course' | 'Project' | 'Skill' | 'Article';
    tag: string;
    duration: string;
  }[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionCard?: {
    title: string;
    description: string;
    ctaText: string;
    actionType: 'ADD_TO_ROADMAP' | 'EXPLORE_CAREER' | 'VIEW_LESSON';
    payload?: Record<string, any>;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  updatedAt: string;
}
