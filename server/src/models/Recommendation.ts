import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendationItem {
  careerId?: mongoose.Types.ObjectId;
  career: string;
  matchScore: number;
  confidence: number;
  reasons: string[];
  skillGaps: string[];
}

export interface IRecommendation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  recommendations: IRecommendationItem[];
  targetCareer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetCareer: { type: String, default: '' },
    recommendations: [
      {
        careerId: { type: Schema.Types.ObjectId, ref: 'Career' },
        career: { type: String, required: true },
        matchScore: { type: Number, required: true },
        confidence: { type: Number, required: true },
        reasons: { type: [String], default: [] },
        skillGaps: { type: [String], default: [] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

recommendationSchema.index({ userId: 1, createdAt: -1 });

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
