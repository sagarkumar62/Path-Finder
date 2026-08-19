import { z } from 'zod';

export const feedbackSchema = z.object({
  recommendationId: z.string().optional(),
  roadmapId: z.string().optional(),
  rating: z.number().min(1).max(5),
  useful: z.boolean().default(true),
  reason: z.string().optional(),
  comments: z.string().optional(),
});
