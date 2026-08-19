'use client';

import { useQuery } from '@tanstack/react-query';
import { Award, Flame, Clock, CheckCircle2, Trophy, BarChart2, Activity } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

export default function ProgressPage() {
  const { profile: authProfile } = useAuth();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.getProgress()
  });

  if (isLoading || !progress) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </AppLayout>
    );
  }

  // Defensive fallbacks — guard against unexpected backend shapes & sync skills count with profile
  const safeProgress = {
    totalLearningHours: progress.totalLearningHours ?? 0,
    currentStreakDays: progress.currentStreakDays ?? 0,
    completedMilestonesCount: progress.completedMilestonesCount ?? 0,
    acquiredSkillsCount: (Array.isArray(authProfile?.skills) && authProfile.skills.length > 0)
      ? authProfile.skills.length
      : (progress.acquiredSkillsCount ?? 0),
    completedProjectsCount: progress.completedProjectsCount ?? 0,
    recentActivity: Array.isArray(progress.recentActivity) ? progress.recentActivity : []
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Learning Progress</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your study hours, streak, acquired skills, and completed milestones.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Learning</p>
              <h3 className="text-2xl font-black text-slate-900">{safeProgress.totalLearningHours} hrs</h3>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Streak</p>
              <h3 className="text-2xl font-black text-slate-900">{safeProgress.currentStreakDays} Days</h3>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Milestones</p>
              <h3 className="text-2xl font-black text-slate-900">{safeProgress.completedMilestonesCount} Done</h3>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skills Acquired</p>
              <h3 className="text-2xl font-black text-slate-900">{safeProgress.acquiredSkillsCount} Skills</h3>
            </div>
          </Card>
        </div>

        {/* Recent Activity Log */}
        <Card className="p-6 bg-white border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="font-extrabold text-slate-900 text-lg">Recent Learning Activity</h2>
          </div>

          <div className="space-y-3">
            {safeProgress.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent activity recorded yet. Complete a milestone to see your progress here.</p>
            ) : (
              safeProgress.recentActivity.map((act) => (
                <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Badge variant="primary">{act.type}</Badge>
                    <span className="font-semibold text-slate-900">{act.title}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{act.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
