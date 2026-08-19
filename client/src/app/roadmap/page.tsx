'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, CheckCircle2, Circle, RefreshCw, Clock, Calendar, BookOpen, Video, Code2, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

export default function RoadmapPage() {
  const queryClient = useQueryClient();
  const { profile: authProfile } = useAuth();

  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: () => api.getRoadmap()
  });

  const milestoneMutation = useMutation({
    mutationFn: ({ phaseId, milestoneId }: { phaseId: string; milestoneId: string }) =>
      api.toggleMilestone(phaseId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  if (isLoading || !roadmap) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </AppLayout>
    );
  }

  // Defensive normalization — guard every array field before use & sync with live profile
  const safeRoadmap = {
    careerTitle: authProfile?.targetCareerGoal || (authProfile as any)?.targetCareer || roadmap.careerTitle || 'Your Target Career',
    overallCompletionPercent: roadmap.overallCompletionPercent ?? 0,
    weeklyCommitmentHours: authProfile?.learningPreferences?.weeklyHours || (authProfile as any)?.weeklyLearningHours || roadmap.weeklyCommitmentHours || 10,
    adaptiveEvents: Array.isArray(roadmap.adaptiveEvents) ? roadmap.adaptiveEvents : [],
    phases: Array.isArray(roadmap.phases)
      ? roadmap.phases.map((phase) => ({
          ...phase,
          skillsCovered: Array.isArray(phase.skillsCovered) ? phase.skillsCovered : [],
          milestones: Array.isArray(phase.milestones) ? phase.milestones : [],
          resources: Array.isArray(phase.resources) ? phase.resources : []
        }))
      : []
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200/60 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized AI Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{safeRoadmap.careerTitle} Roadmap</h1>
            <p className="text-slate-500 text-sm mt-0.5">Custom timeline calibrated for your target goal and weekly schedule.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs shrink-0">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Completion</p>
              <p className="text-xl font-black text-emerald-600">{safeRoadmap.overallCompletionPercent}%</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Commitment</p>
              <p className="text-sm font-extrabold text-slate-900">{safeRoadmap.weeklyCommitmentHours} hrs/wk</p>
            </div>
          </div>
        </div>

        {/* Adaptive Adjustment Banner */}
        {safeRoadmap.adaptiveEvents.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
            <RefreshCw className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">⚡ Adaptive Learning Adjustment Triggered</h4>
              <p className="text-xs text-amber-800">
                {safeRoadmap.adaptiveEvents[0].reason} — <strong>{safeRoadmap.adaptiveEvents[0].adjustment}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Timeline Phases */}
        <div className="space-y-6">
          {safeRoadmap.phases.length === 0 ? (
            <Card className="p-10 text-center space-y-3 border-dashed border-2 border-slate-200">
              <p className="text-slate-500 text-sm">No roadmap phases generated yet.</p>
              <p className="text-xs text-slate-400">Go to Recommendations and select a career to generate your personalized roadmap.</p>
            </Card>
          ) : safeRoadmap.phases.map((phase) => {
            const isCompleted = phase.isCompleted;
            const isCurrent = phase.isCurrent;

            return (
              <Card
                key={phase.id}
                className={`p-6 bg-white rounded-2xl transition-all ${
                  isCurrent
                    ? 'border-2 border-indigo-600 shadow-md ring-4 ring-indigo-50'
                    : isCompleted
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '✓' : phase.phaseNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg text-slate-900">{phase.title}</h3>
                          {isCurrent && <Badge variant="ai">Active Phase</Badge>}
                          {isCompleted && <Badge variant="success">Completed</Badge>}
                        </div>
                        <p className="text-xs text-slate-500">{phase.summary} • Duration: {phase.durationWeeks} weeks</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {phase.skillsCovered.map((sk) => (
                        <Badge key={sk} variant="secondary" className="text-[10px]">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Checkable Milestones</h4>
                    <div className="space-y-2">
                      {phase.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => milestoneMutation.mutate({ phaseId: phase.id, milestoneId: m.id })}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                            m.completed
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                              : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {m.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h5 className={`text-xs font-bold ${m.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {m.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Curated Resources */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Curated Learning Resources</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {phase.resources.map((res) => (
                        <div key={res.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {res.type === 'Video' ? <Video className="h-4 w-4 text-indigo-600" /> : <BookOpen className="h-4 w-4 text-sky-600" />}
                            <div>
                              <p className="font-bold text-slate-900">{res.title}</p>
                              <p className="text-[10px] text-slate-500">{res.type} • {res.duration}</p>
                            </div>
                          </div>
                          <a href={res.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
