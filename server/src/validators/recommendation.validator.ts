import { z } from 'zod';

export const recommendationRequestSchema = z.object({
  targetCareer: z.string().optional(),
});

export const skillGapRequestSchema = z.object({
  targetCareer: z.string().optional(),
});

export const adaptRecommendationSchema = z.object({
  roadmapId: z.string().optional(),
  feedbackId: z.string().optional(),
});
