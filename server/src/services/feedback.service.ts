import { Feedback, IFeedback } from '../models/Feedback';

export interface FeedbackInput {
  recommendationId?: string;
  roadmapId?: string;
  rating: number;
  useful: boolean;
  reason?: string;
  comments?: string;
}

export class FeedbackService {
  async submitFeedback(userId: string, input: FeedbackInput): Promise<IFeedback> {
    const feedback = await Feedback.create({
      userId,
      ...input,
    });
    return feedback;
  }

  async getUserFeedback(userId: string): Promise<IFeedback[]> {
    return Feedback.find({ userId }).sort({ createdAt: -1 });
  }
}

export const feedbackService = new FeedbackService();
