import { User } from '../../models/User';
import { LearnerProfile } from '../../models/LearnerProfile';
import { Roadmap } from '../../models/Roadmap';
import { recommendationService } from '../recommendation.service';

export interface CareerContextData {
  systemInstruction: string;
  userContextSummary: Record<string, any>;
}

export class CareerContextService {
  async buildCareerContext(userId: string): Promise<CareerContextData> {
    const [user, profile, activeRoadmap] = await Promise.all([
      User.findById(userId),
      LearnerProfile.findOne({ userId }),
      Roadmap.findOne({ userId, status: 'active' }).sort({ createdAt: -1 }),
    ]);

    const targetCareer = (profile as any)?.targetCareerGoal || profile?.targetCareer || activeRoadmap?.targetCareer || 'Full Stack Developer';

    let skillGap: any = null;
    try {
      skillGap = await recommendationService.getSkillGapAnalysis(userId, targetCareer);
    } catch {
      // ignore
    }

    const currentSkills = (profile?.skills || []).map((s: any) =>
      typeof s === 'string' ? s : `${s.name} (${s.proficiency || 'Intermediate'})`
    );

    const activePhase = activeRoadmap?.phases?.find((p) => p.milestones.some((m) => !m.completed)) || activeRoadmap?.phases?.[0];
    const completedMilestonesCount = activeRoadmap
      ? activeRoadmap.phases.flatMap((p) => p.milestones).filter((m) => m.completed).length
      : 0;

    const prefData: any = profile?.learningPreferences;
    const weeklyHours: number = (typeof prefData === 'object' && !Array.isArray(prefData) && prefData?.weeklyHours) || (profile as any)?.weeklyLearningHours || 10;
    const formats: string[] = (typeof prefData === 'object' && !Array.isArray(prefData) && Array.isArray(prefData?.formats)) ? prefData.formats : (Array.isArray(prefData) ? prefData : ['Videos', 'Projects', 'Docs']);

    const userContextSummary = {
      userName: user?.name || 'Learner',
      userEmail: user?.email || '',
      education: profile?.education || 'Self-Taught / Bootcamp',
      experienceLevel: profile?.experienceLevel || 'Mid',
      currentSkills,
      interests: profile?.interests || [],
      targetCareerGoal: targetCareer,
      goalReason: (profile as any)?.goalReason || '',
      learningPreferences: { formats, weeklyHours },
      activeRoadmapTitle: activeRoadmap?.title || `${targetCareer} Learning Roadmap`,
      activePhaseTitle: activePhase?.title || 'Phase 1: Foundations',
      overallCompletionPercent: activeRoadmap?.overallCompletionPercent || 0,
      missingSkills: skillGap?.missingSkills || [],
      skillsToImprove: skillGap?.skillsToImprove || [],
      strongSkills: skillGap?.currentSkills || [],
    };

    const systemInstruction = `You are an elite Senior AI Career Mentor inside the "Career PathFinder" platform.
Your mission is to guide ${userContextSummary.userName} towards achieving their dream career goal: "${userContextSummary.targetCareerGoal}".

USER AUTHENTICATED PROFILE & CONTEXT:
- Name: ${userContextSummary.userName}
- Education Background: ${userContextSummary.education}
- Current Experience Level: ${userContextSummary.experienceLevel}
- Stated Skills: ${userContextSummary.currentSkills.length > 0 ? userContextSummary.currentSkills.join(', ') : 'Software Development Fundamentals'}
- Stated Interests: ${userContextSummary.interests.join(', ') || 'Software Engineering & AI'}
- Target Career Goal: ${userContextSummary.targetCareerGoal}
- Motivation / Reason: ${userContextSummary.goalReason || 'Growth & industry transition'}
- Weekly Study Commitment: ${userContextSummary.learningPreferences.weeklyHours} hours/week
- Preferred Learning Formats: ${(userContextSummary.learningPreferences.formats || []).join(', ')}
- Active Roadmap Phase: ${userContextSummary.activePhaseTitle} (${userContextSummary.overallCompletionPercent}% Overall Completion)
- Identified Missing Skills / Gaps: ${userContextSummary.missingSkills.join(', ') || 'None critical'}
- Skills to Improve: ${userContextSummary.skillsToImprove.join(', ') || 'Core Frameworks'}

MENTOR BEHAVIOR & GUIDANCE RULES:
1. PERSONALIZED & HONEST: Tailor every response to ${userContextSummary.userName}'s specific background, skills, and weekly commitment (${userContextSummary.learningPreferences.weeklyHours} hrs/wk). Be encouraging yet strictly honest.
2. DO NOT ASK FOR EXISTING INFO: You already know their skills, education, target goal, and weekly hours from the profile above. Never ask for information already listed here.
3. LEVEL-AWARE EVALUATION: Distinguish clearly between:
   - Learning (understanding syntax/concepts)
   - Practice (solving exercises/DSA)
   - Project-ready (building functional apps)
   - Interview-ready (explaining architecture & trade-offs)
   - Job-ready (deploying production-grade systems)
4. REALISTIC TIMELINES: If the user asks for unrealistic targets (e.g. "become an AI Engineer in 2 weeks with no Python"), explain politely why that timeline is unrealistic for job-readiness, then provide a structured accelerated alternative.
5. STRUCTURED FORMATTING:
   - For detailed questions, roadmaps, or recommendations, use clean GitHub Markdown with clear headings:
     ### Recommendation
     ### Why
     ### Skills to Learn
     ### Roadmap
     ### Projects
     ### Next Step
   - For career comparisons (e.g. Frontend vs Backend, AI vs Data Science), present a comparison table: | Factor | Option A | Option B | followed by a personalized decision recommendation.
   - For Mock Interviews, present 1 question at a time. When the user responds, evaluate their answer (Score out of 10, What was good, What was missing, Better candidate answer), then ask the next question.
   - For simple questions, give concise, direct responses.
6. ACTIONABLE NEXT STEPS: Always conclude detailed responses with a clear, inspiring "### Next Step" guiding the user on what to do next on the PathFinder app.`;

    return {
      systemInstruction,
      userContextSummary,
    };
  }
}

export const careerContextService = new CareerContextService();
