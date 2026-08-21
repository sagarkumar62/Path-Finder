import { z } from 'zod';

const completedCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  platform: z.string().optional(),
  completionDate: z.string().or(z.date()).optional(),
  url: z.string().optional(),
});

const certificationSchema = z.object({
  title: z.string().min(1, 'Certification title is required'),
  issuer: z.string().optional(),
  issueDate: z.string().or(z.date()).optional(),
  credentialUrl: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

const skillObjectSchema = z.object({
  name: z.string(),
  proficiency: z.string().optional(),
  category: z.string().optional(),
});

export const profileSchema = z.object({
  education: z.string().optional(),
  educationLevel: z.string().optional(),
  experienceLevel: z.string().optional(),
  currentRole: z.string().optional(),
  targetCareer: z.string().optional(),
  targetCareerGoal: z.string().optional(),
  goalReason: z.string().optional(),
  skills: z.array(z.union([z.string(), skillObjectSchema])).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  careerGoals: z.array(z.string()).optional().default([]),
  learningPreferences: z.any().optional().default([]),
  preferredLearningStyle: z.string().optional(),
  weeklyLearningHours: z.number().optional(),
  completedCourses: z.array(completedCourseSchema).optional().default([]),
  certifications: z.array(certificationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  languages: z.array(z.string()).optional().default(['English']),
  location: z.string().optional(),
  previousLearningHistory: z.string().optional(),
  currentKnowledgeLevel: z.string().optional(),
});

export const profileUpdateSchema = profileSchema.partial();

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

