'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Compass, Layers, Check } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatchScore } from '@/components/ui/match-score';
import { api } from '@/lib/api';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RecommendationsPage() {
  const router = useRouter();
  const { profile, updateUserAndProfile } = useAuth();
  const currentActiveGoalTitle = profile?.targetCareerGoal || (profile as any)?.targetCareer || 'AI Engineer';

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.getRecommendations()
  });

  const [compareIds, setCompareIds] = useState<string[]>(['car_ai_eng', 'car_fs_dev']);
  const [settingGoalId, setSettingGoalId] = useState<string | null>(null);

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 3) return;
      setCompareIds([...compareIds, id]);
    }
  };

  const handleSetActiveGoal = async (careerId: string, careerTitle: string) => {
    try {
      setSettingGoalId(careerId);
      await updateUserAndProfile({}, { targetCareerGoal: careerTitle, targetCareer: careerTitle } as any);
      await api.generateRoadmap(careerId);
      router.push('/roadmap');
    } catch (err) {
      console.error('Failed to set active goal:', err);
    } finally {
      setSettingGoalId(null);
    }
  };

  if (isLoading || !recommendations) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </AppLayout>
    );
  }

  const comparedCareers = recommendations.filter(r => compareIds.includes(r.id));

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200/60 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Career Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Career Paths Built For You</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Active Goal: <strong className="text-indigo-600">{currentActiveGoalTitle}</strong> — Matched against your skills, goals, and schedule.
            </p>
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendations.map((car) => {
            const isCompared = compareIds.includes(car.id);
            const isActiveGoal = car.title.toLowerCase() === currentActiveGoalTitle.toLowerCase();

            return (
              <Card
                key={car.id}
                className={`p-6 flex flex-col justify-between bg-white shadow-soft hover:shadow-lg transition-all rounded-2xl space-y-6 ${
                  isActiveGoal ? 'border-2 border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-xl text-slate-900">{car.title}</h2>
                        {isActiveGoal && <Badge variant="ai">Active Goal</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="primary">{car.difficulty} Difficulty</Badge>
                        <span className="text-xs font-medium text-slate-500">{car.estimatedTransition}</span>
                      </div>
                    </div>
                    <MatchScore score={car.matchScore} size="sm" showLabel={false} />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{car.description}</p>

                  {/* Why It Matches */}
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Why It Matches</h4>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      {car.whyMatches.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skill Gaps */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Skill Gaps</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {car.skillGaps.map((sg, i) => (
                        <Badge key={i} variant="warning" className="text-[10px]">
                          {sg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/careers/${car.id}`} className="flex-1">
                      <Button variant="primary" size="md" className="w-full font-bold gap-1.5 text-xs">
                        Explore Details <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant={isCompared ? 'secondary' : 'outline'}
                      size="md"
                      onClick={() => toggleCompare(car.id)}
                      className="font-bold text-xs"
                    >
                      {isCompared ? 'Compared ✓' : '+ Compare'}
                    </Button>
                  </div>

                  <Button
                    variant={isActiveGoal ? 'secondary' : 'ai'}
                    size="sm"
                    disabled={settingGoalId === car.id}
                    onClick={() => handleSetActiveGoal(car.id, car.title)}
                    className="w-full font-bold text-xs gap-1.5"
                  >
                    {isActiveGoal ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> Active Career Goal
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> Set as Active Goal & Build Roadmap
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Drawer */}
        {comparedCareers.length > 0 && (
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Side-by-Side Career Comparison</h2>
            </div>

            <Card className="p-6 bg-white border-slate-200 shadow-lg rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-400 uppercase tracking-wider">Criteria</th>
                    {comparedCareers.map(c => (
                      <th key={c.id} className="p-3 font-extrabold text-slate-900 text-sm">{c.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-600">AI Match Score</td>
                    {comparedCareers.map(c => (
                      <td key={c.id} className="p-3 font-extrabold text-indigo-600 text-sm">{c.matchScore}% Fit</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600">Difficulty</td>
                    {comparedCareers.map(c => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">{c.difficulty}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600">Estimated Transition</td>
                    {comparedCareers.map(c => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">{c.estimatedTransition}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600">Average Salary Range</td>
                    {comparedCareers.map(c => (
                      <td key={c.id} className="p-3 font-semibold text-emerald-700">{c.averageSalary || 'N/A'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
