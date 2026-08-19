import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  recommendationId?: mongoose.Types.ObjectId;
  roadmapId?: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  useful: boolean;
  reason?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recommendationId: {
      type: Schema.Types.ObjectId,
      ref: 'Recommendation',
      index: true,
    },
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: 'Roadmap',
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    useful: { type: Boolean, default: true },
    reason: { type: String, default: '' },
    comments: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
