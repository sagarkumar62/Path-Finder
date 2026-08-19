import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  roadmapId: mongoose.Types.ObjectId;
  phaseId: string;
  milestoneId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionPercentage: number;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // in hours or minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
      index: true,
    },
    phaseId: { type: String, required: true },
    milestoneId: { type: String, required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ userId: 1, roadmapId: 1 });
progressSchema.index({ userId: 1, milestoneId: 1 });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
