'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Sparkles,
  RefreshCw,
  Save,
  Check,
  Edit3,
  X,
  Plus,
  Trash2,
  Mail,
  GraduationCap,
  Briefcase,
  Target,
  Clock,
  BookOpen,
  MapPin,
  Award,
  Compass
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { ConfirmSaveModal } from '@/components/profile/ConfirmSaveModal';
import { Skill, SkillProficiency } from '@/types';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, updateUserAndProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [education, setEducation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Mid' | 'Senior' | 'Lead'>('Mid');
  const [currentRole, setCurrentRole] = useState('');
  const [location, setLocation] = useState('');
  const [targetCareerGoal, setTargetCareerGoal] = useState('');
  const [goalReason, setGoalReason] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [preferredLearningStyle, setPreferredLearningStyle] = useState('Projects & Interactive');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // New Skill Input State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Intermediate');

  // New Interest Input State
  const [newInterest, setNewInterest] = useState('');

  // Sync Form state when auth user/profile loads or changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
    if (profile) {
      setEducation(profile.education || '');
      setExperienceLevel(profile.experienceLevel || 'Mid');
      setCurrentRole((profile as any).currentRole || '');
      setLocation((profile as any).location || '');
      setTargetCareerGoal(profile.targetCareerGoal || (profile as any).targetCareer || 'AI Engineer');
      setGoalReason(profile.goalReason || '');
      setWeeklyHours(profile.learningPreferences?.weeklyHours || (profile as any).weeklyLearningHours || 10);
      setPreferredLearningStyle((profile as any).preferredLearningStyle || 'Projects & Interactive');

      // Normalize skills selected or entered at registration/onboarding
      if (Array.isArray(profile.skills) && profile.skills.length > 0) {
        const parsedSkills: Skill[] = profile.skills.map((s: any) => {
          if (typeof s === 'string') {
            return { name: s, proficiency: 'Intermediate', category: 'programming' };
          }
          return {
            name: s.name || s.title || String(s),
            proficiency: s.proficiency || 'Intermediate',
            category: s.category || 'programming'
          };
        });
        setSkills(parsedSkills);
      }

      if (Array.isArray(profile.interests)) {
        setInterests(profile.interests);
      }
    }
  }, [user, profile]);

  const handleReanalyze = () => {
    router.push('/onboarding');
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSaving(true);

      const updatedUserData = {
        name
      };

      const updatedProfileData = {
        education,
        experienceLevel,
        currentRole,
        location,
        targetCareerGoal,
        goalReason,
        skills,
        interests,
        preferredLearningStyle,
        learningPreferences: {
          formats: ['Projects', 'Interactive', 'Videos', 'Docs'],
          weeklyHours
        }
      };

      await updateUserAndProfile(updatedUserData, updatedProfileData as any);

      setShowConfirmModal(false);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    setSkills([
      ...skills,
      { name: newSkillName.trim(), proficiency: newSkillProficiency, category: 'programming' }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (interests.some(i => i.toLowerCase() === newInterest.trim().toLowerCase())) return;

    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(i => i !== interestToRemove));
  };

  if (authLoading && !user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </AppLayout>
    );
  }

  const userInitials = getInitials(name || user?.name);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Learner Profile</span>
              {isEditing && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  Editing Mode
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your personal information, skill set, and career goals.</p>
          </div>
          <div className="flex items-center gap-2.5">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2 font-bold text-slate-700">
                  <Edit3 className="h-4 w-4 text-indigo-600" /> Edit Profile
                </Button>
                <Button variant="ai" onClick={handleReanalyze} className="gap-2 font-bold">
                  <RefreshCw className="h-4 w-4" /> Re-Analyze Career
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2 font-bold text-rose-600 hover:bg-rose-50 border-rose-200">
                <X className="h-4 w-4" /> Cancel Editing
              </Button>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-xs">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span>Profile updated successfully! Your updated name and details are now reflected across PATHFINDER.</span>
          </div>
        )}

        {/* Profile Card Header */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="h-20 w-20 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl text-indigo-200 shadow-inner">
              {userInitials}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{user?.name || name || 'Learner'}</h2>
                <Badge variant="primary" className="w-fit mx-auto sm:mx-0 bg-indigo-500/40 text-indigo-100 border-indigo-400/30">
                  {experienceLevel} Level Learner
                </Badge>
              </div>
              <p className="text-indigo-200 text-xs flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-300" /> {user?.email || 'learner@example.com'}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-100/90 font-medium">
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-indigo-400" /> Goal: <strong className="text-white">{targetCareerGoal || 'AI Engineer'}</strong>
                </span>
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Profile Form */}
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-soft rounded-2xl space-y-6">

            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserIcon className="h-5 w-5 text-indigo-600" />
                <h2 className="font-extrabold text-base text-slate-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Sagar Sharma"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                  ) : (
                    <div className="h-10 px-3 text-sm rounded-lg border border-slate-100 bg-slate-50 flex items-center font-bold text-slate-800">
                      {name || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address (Read-only)</label>
                  <div className="h-10 px-3 text-sm rounded-lg border border-slate-100 bg-slate-50 flex items-center text-slate-500 font-medium">
                    {user?.email || 'learner@example.com'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Education / Qualification</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="h-10 px-3 text-sm rounded-lg border border-slate-100 bg-slate-50 flex items-center font-medium text-slate-800">
                      {education || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full h-10 px-3 text-sm rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="h-10 px-3 text-sm rounded-lg border border-slate-100 bg-slate-50 flex items-center font-medium text-slate-800">
                      {location || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Career Goals & Experience */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Target className="h-5 w-5 text-indigo-600" />
                <h2 className="font-extrabold text-base text-slate-900">Career Goal & Experience</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Career Goal</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={targetCareerGoal}
                      onChange={(e) => setTargetCareerGoal(e.target.value)}
                      placeholder="e.g. AI Engineer"
                      className="w-full h-10 px-3 text-sm font-semibold rounded-lg border border-indigo-300 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="h-10 px-3 text-sm font-bold rounded-lg border border-slate-100 bg-indigo-50/50 text-indigo-700 flex items-center">
                      {targetCareerGoal || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Experience Level</label>
                  {isEditing ? (
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Lead">Lead Level</option>
                    </select>
                  ) : (
                    <div className="h-10 px-3 text-sm rounded-lg border border-slate-100 bg-slate-50 flex items-center font-bold text-slate-800">
                      {experienceLevel} Level
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Goal Motivation / Career Reason</label>
                {isEditing ? (
                  <textarea
                    value={goalReason}
                    onChange={(e) => setGoalReason(e.target.value)}
                    rows={2}
                    placeholder="Describe why you want to pursue this career..."
                    className="w-full p-3 text-xs rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="p-3 text-xs rounded-lg border border-slate-100 bg-slate-50 text-slate-700 font-medium leading-relaxed">
                    {goalReason || 'No motivation statement added yet.'}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Current Skills */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <h2 className="font-extrabold text-base text-slate-900">Current Skills</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">{skills.length} skills added</span>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <div
                    key={sk.name}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span>{sk.name}</span>
                    <Badge variant={sk.proficiency === 'Advanced' ? 'primary' : 'outline'} className="text-[10px]">
                      {sk.proficiency}
                    </Badge>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                        title="Remove skill"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {skills.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                )}
              </div>

              {/* Add Skill Input in Edit Mode */}
              {isEditing && (
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Skill name (e.g. Docker, PyTorch)"
                    className="w-full sm:w-1/2 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                    className="w-full sm:w-1/3 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleAddSkill}
                    className="w-full sm:w-auto font-bold text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              )}
            </div>

            {/* Section 4: Interests & Learning Preferences */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="font-extrabold text-base text-slate-900">Interests & Learning Preferences</h2>
              </div>

              {/* Interests Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Career Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <div
                      key={interest}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 text-xs font-bold"
                    >
                      <span>{interest}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-indigo-400 hover:text-rose-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {interests.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No interests listed.</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add interest (e.g. Cloud Security, LLMs)"
                      className="h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 flex-1 max-w-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddInterest}
                      className="font-bold text-xs gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Interest
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Weekly Learning Hours</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min={1}
                      max={80}
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(parseInt(e.target.value) || 10)}
                      className="w-full h-10 px-3 text-sm font-semibold rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="h-10 px-3 text-sm font-bold rounded-lg border border-slate-100 bg-slate-50 flex items-center text-slate-800">
                      {weeklyHours} hours / week
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Preferred Learning Style</label>
                  {isEditing ? (
                    <select
                      value={preferredLearningStyle}
                      onChange={(e) => setPreferredLearningStyle(e.target.value)}
                      className="w-full h-10 px-3 text-sm font-semibold rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Projects & Interactive Labs">Projects & Interactive Labs</option>
                      <option value="Video Courses & Tutorials">Video Courses & Tutorials</option>
                      <option value="Documentation & Articles">Documentation & Articles</option>
                      <option value="Structured Bootcamps">Structured Bootcamps</option>
                    </select>
                  ) : (
                    <div className="h-10 px-3 text-sm font-bold rounded-lg border border-slate-100 bg-slate-50 flex items-center text-slate-800">
                      {preferredLearningStyle}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            {isEditing && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="gap-2 font-bold text-xs px-6 shadow-md"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </Card>
        </form>

        {/* Confirmation Modal */}
        <ConfirmSaveModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
          loading={saving}
        />
      </div>
    </AppLayout>
  );
}
