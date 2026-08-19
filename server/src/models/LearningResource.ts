import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningResource extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: string; // Video, Article, Course, Book, Project
  url: string;
  difficulty: string; // Beginner, Intermediate, Advanced
  skillsCovered: string[];
  isFree: boolean;
  provider?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const learningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'Course' },
    url: { type: String, default: '' },
    difficulty: { type: String, default: 'Beginner' },
    skillsCovered: { type: [String], default: [] },
    isFree: { type: Boolean, default: true },
    provider: { type: String, default: 'YouTube / Coursera' },
    rating: { type: Number, default: 4.5 },
  },
  {
    timestamps: true,
  }
);

export const LearningResource = mongoose.model<ILearningResource>('LearningResource', learningResourceSchema);
