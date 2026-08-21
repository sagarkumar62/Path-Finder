'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Filter,
  Plus,
  Check,
  Loader2,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MatchScore } from '@/components/ui/match-score';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SkillGapAnalysis, SkillGapDetail, SkillProficiency } from '@/types';

const CAREER_OPTIONS = [
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer'
];

export function matchBestCareerGoal(input?: string): string {
  if (!input) return 'Full Stack Developer';
  const norm = input.trim().toLowerCase();

  const exactMatch = CAREER_OPTIONS.find(c => c.toLowerCase() === norm);
  if (exactMatch) return exactMatch;

  if (norm.includes('web') || norm.includes('full stack') || norm.includes('fullstack') || norm.includes('software')) {
    return 'Full Stack Developer';
  }
  if (norm.includes('frontend') || norm.includes('front end')) {
    return 'Frontend Developer';
  }
  if (norm.includes('backend') || norm.includes('back end')) {
    return 'Backend Developer';
  }
  if (norm.includes('ai') || norm.includes('llm') || norm.includes('genai')) {
    return 'AI Engineer';
  }
  if (norm.includes('machine learning') || norm.includes('ml')) {
    return 'Machine Learning Engineer';
  }
  if (norm.includes('data science') || norm.includes('scientist')) {
    return 'Data Scientist';
  }
  if (norm.includes('data analyst') || norm.includes('analytics')) {
    return 'Data Analyst';
  }
  if (norm.includes('devops') || norm.includes('ci/cd')) {
    return 'DevOps Engineer';
  }
  if (norm.includes('cloud') || norm.includes('aws') || norm.includes('azure')) {
    return 'Cloud Engineer';
  }
  if (norm.includes('cyber') || norm.includes('security')) {
    return 'Cybersecurity Analyst';
  }
  if (norm.includes('mobile') || norm.includes('react native') || norm.includes('ios') || norm.includes('android')) {
    return 'Mobile Developer';
  }
  if (norm.includes('design') || norm.includes('ux') || norm.includes('figma')) {
    return 'UI/UX Designer';
  }

  const fuzzyMatch = CAREER_OPTIONS.find(c => c.toLowerCase().includes(norm) || norm.includes(c.toLowerCase()));
  return fuzzyMatch || 'Full Stack Developer';
}

function SkillGapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTargetCareer = searchParams.get('targetCareer');
  const queryClient = useQueryClient();
  const { profile, updateUserAndProfile, loading: authLoading } = useAuth();

  const [selectedCareer, setSelectedCareer] = useState<string>('Full Stack Developer');
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'missing' | 'needsWork' | 'strong'>('all');
  const [upgradingSkill, setUpgradingSkill] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync selected career with URL parameter or profile goal ONCE upon initial load
  useEffect(() => {
    if (!hasInitialized) {
      if (urlTargetCareer) {
        setSelectedCareer(matchBestCareerGoal(urlTargetCareer));
        setHasInitialized(true);
      } else if (profile) {
        const activeGoal = profile.targetCareerGoal || (profile as any).targetCareer;
        setSelectedCareer(matchBestCareerGoal(activeGoal));
        setHasInitialized(true);
      }
    }
  }, [profile, urlTargetCareer, hasInitialized]);

  // React Query for real-time skill gap analysis
  const { data: skillGapData, isLoading: loadingGap } = useQuery({
    queryKey: ['skill-gap', selectedCareer],
    queryFn: () => api.getSkillGap(selectedCareer),
    enabled: Boolean(selectedCareer)
  });

  // Handle instant real-time skill acquisition / upgrade
  const handleUpgradeSkill = async (skillName: string, proficiency: SkillProficiency = 'Advanced') => {
    try {
      setUpgradingSkill(skillName);

      const existingSkills = profile?.skills || [];
      const normalizedExisting = existingSkills.map((s: any) =>
        typeof s === 'string' ? { name: s, proficiency: 'Intermediate', category: 'programming' } : s
      );

      const existsIndex = normalizedExisting.findIndex((s: any) => s.name.toLowerCase() === skillName.toLowerCase());

      let updatedSkills = [...normalizedExisting];
      if (existsIndex >= 0) {
        updatedSkills[existsIndex] = { ...updatedSkills[existsIndex], proficiency };
      } else {
        updatedSkills.push({ name: skillName, proficiency, category: 'programming' });
      }

      await updateUserAndProfile({}, { skills: updatedSkills } as any);

      // Re-fetch / invalidate all related query keys
      queryClient.invalidateQueries({ queryKey: ['skill-gap'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });

      setSuccessMessage(`Updated "${skillName}" to ${proficiency}! Skill gap updated in real time.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to update skill:', err);
    } finally {
      setUpgradingSkill(null);
    }
  };

  const detailsList: SkillGapDetail[] = skillGapData?.details || [];
  const missingSkillsList = detailsList.filter((d) => d.category === 'missing').map((d) => d.name);
  const needsWorkSkillsList = detailsList.filter((d) => d.category === 'needsWork').map((d) => d.name);

  const filteredDetails = detailsList.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const totalRequired = detailsList.length || 1;
  const strongCount = skillGapData?.summary?.strongCount ?? detailsList.filter(d => d.category === 'strong').length;
  const needsWorkCount = skillGapData?.summary?.needsWorkCount ?? needsWorkSkillsList.length;
  const missingCount = skillGapData?.summary?.missingCount ?? missingSkillsList.length;

  const coveragePercent = Math.round((strongCount / totalRequired) * 100);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Toast Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-lg font-bold text-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-200 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Target className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Skill Gap Details</h1>
              <Badge variant="primary" className="text-xs uppercase font-bold tracking-wider">Real-Time</Badge>
            </div>
            <p className="text-slate-500 text-sm">
              Live competency matrix comparing your active profile against industry benchmarks.
            </p>
          </div>

          {/* Career Goal Selector */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider pl-2">Target Goal:</span>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="h-9 px-3 text-xs font-extrabold text-indigo-700 bg-indigo-50/70 border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {CAREER_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Readiness Gauge */}
          <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
            <MatchScore score={coveragePercent} size="sm" showLabel={false} />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skill Coverage</p>
              <h3 className="font-extrabold text-slate-900 text-base mt-0.5">{coveragePercent}% Readiness</h3>
              <p className="text-[11px] text-emerald-600 font-bold">{strongCount} of {totalRequired} Skills Mastered</p>
            </div>
          </Card>

          {/* Strong Skills */}
          <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Strong Skills</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{strongCount}</h3>
              <p className="text-[11px] text-emerald-600 font-bold">Competent & Mastered</p>
            </div>
          </Card>

          {/* Needs Improvement */}
          <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Needs Work</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{needsWorkCount}</h3>
              <p className="text-[11px] text-amber-600 font-bold">Intermediate proficiency</p>
            </div>
          </Card>

          {/* Missing Skills */}
          <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
            <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Missing Skills</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{missingCount}</h3>
              <p className="text-[11px] text-rose-600 font-bold">High priority targets</p>
            </div>
          </Card>
        </div>

        {/* Strategic Guidance Banner */}
        <Card className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl shadow-lg border-none relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                  AI Skill Gap Strategy
                </span>
              </div>
              <h3 className="text-lg font-black leading-snug">
                Bridge your skill gap for <span className="text-indigo-200 underline font-extrabold">{selectedCareer}</span>
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed">
                {missingSkillsList.length > 0
                  ? `Missing skills for ${selectedCareer}: ${missingSkillsList.join(', ')}. Upgrade or acquire these key skills to maximize your match score.`
                  : `Exceptional work! You possess all essential core skills required for ${selectedCareer}. Keep refining your intermediate areas.`}
              </p>
            </div>

            <Button
              variant="ai"
              size="md"
              onClick={() => router.push('/roadmap')}
              className="gap-2 font-extrabold shadow-glow-indigo whitespace-nowrap"
            >
              View Adaptive Roadmap <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Skill Matrix Filter & Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-extrabold text-slate-900">Competency Matrix</h2>
              <span className="text-xs text-slate-400 font-semibold">({filteredDetails.length} skills listed)</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({detailsList.length})
              </button>
              <button
                onClick={() => setFilterCategory('missing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterCategory === 'missing' ? 'bg-rose-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Missing ({missingCount})
              </button>
              <button
                onClick={() => setFilterCategory('needsWork')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterCategory === 'needsWork' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Needs Work ({needsWorkCount})
              </button>
              <button
                onClick={() => setFilterCategory('strong')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterCategory === 'strong' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Strong ({strongCount})
              </button>
            </div>
          </div>

          {/* Table Container */}
          <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-2xs">
            {loadingGap ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-xs font-extrabold text-slate-500">Analyzing real-time skill delta...</p>
              </div>
            ) : filteredDetails.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Info className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No skills in this category</p>
                <p className="text-xs text-slate-400">Try switching your filter tabs above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Skill Name</th>
                      <th className="p-4">Category Status</th>
                      <th className="p-4">Proficiency Gauge</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4 text-right">Real-Time Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDetails.map((item) => {
                      const isUpgrading = upgradingSkill === item.name;
                      const levelPercent = (item.currentLevel / item.requiredLevel) * 100;

                      return (
                        <tr key={item.name} className="hover:bg-slate-50/60 transition-colors">
                          {/* Skill Name */}
                          <td className="p-4 font-extrabold text-slate-900 text-sm">
                            <div className="flex items-center gap-2">
                              <span>{item.name}</span>
                              {item.category === 'strong' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="p-4">
                            {item.category === 'strong' ? (
                              <Badge variant="success" className="font-bold">Strong / Mastered</Badge>
                            ) : item.category === 'needsWork' ? (
                              <Badge variant="warning" className="font-bold">Needs Improvement</Badge>
                            ) : (
                              <Badge variant="secondary" className="font-bold bg-rose-50 text-rose-700 border-rose-200">Missing</Badge>
                            )}
                          </td>

                          {/* Gauge */}
                          <td className="p-4 w-48">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                                <span>Level {item.currentLevel} / {item.requiredLevel}</span>
                                <span>{Math.round(levelPercent)}%</span>
                              </div>
                              <Progress
                                value={levelPercent}
                                size="sm"
                                barColor={item.category === 'strong' ? 'bg-emerald-500' : item.category === 'needsWork' ? 'bg-amber-500' : 'bg-rose-500'}
                              />
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                item.priority === 'high'
                                  ? 'bg-rose-100 text-rose-800'
                                  : item.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.priority} Priority
                            </span>
                          </td>

                          {/* Quick Upgrade Action */}
                          <td className="p-4 text-right">
                            {item.category === 'strong' ? (
                              <span className="text-emerald-600 font-extrabold text-xs flex items-center justify-end gap-1">
                                <Check className="h-4 w-4" /> Mastered
                              </span>
                            ) : item.category === 'needsWork' ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isUpgrading}
                                onClick={() => handleUpgradeSkill(item.name, 'Advanced')}
                                className="font-bold text-xs gap-1.5 border-amber-300 bg-amber-50/70 text-amber-900 hover:bg-amber-500 hover:text-white transition-colors shadow-2xs"
                              >
                                {isUpgrading ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <TrendingUp className="h-3.5 w-3.5" /> Upgrade to Advanced
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="primary"
                                disabled={isUpgrading}
                                onClick={() => handleUpgradeSkill(item.name, 'Advanced')}
                                className="font-bold text-xs gap-1 shadow-2xs"
                              >
                                {isUpgrading ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" /> Mark Acquired
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default function SkillGapPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        </AppLayout>
      }
    >
      <SkillGapContent />
    </Suspense>
  );
}
