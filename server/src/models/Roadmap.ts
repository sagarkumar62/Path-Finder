import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestoneResource {
  title: string;
  type?: string;
  url?: string;
}

export interface IMilestone {
  milestoneId: string;
  title: string;
  description: string;
  estimatedHours: number;
  resources: IMilestoneResource[];
  skills: string[];
  order: number;
}

export interface IRoadmapPhase {
  phaseId: string;
  title: string;
  description: string;
  estimatedWeeks: number;
  milestones: IMilestone[];
}

export interface IRoadmap extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  targetCareer: string;
  duration: string;
  estimatedHours: number;
  prerequisites: string[];
  phases: IRoadmapPhase[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<IMilestone>({
  milestoneId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedHours: { type: Number, default: 10 },
  resources: [
    {
      title: { type: String, required: true },
      type: { type: String, default: 'Course' },
      url: { type: String, default: '' },
    },
  ],
  skills: { type: [String], default: [] },
  order: { type: Number, required: true },
});

const phaseSchema = new Schema<IRoadmapPhase>({
  phaseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedWeeks: { type: Number, default: 4 },
  milestones: [milestoneSchema],
});

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    targetCareer: { type: String, required: true },
    duration: { type: String, default: '6 Months' },
    estimatedHours: { type: Number, default: 200 },
    prerequisites: { type: [String], default: [] },
    phases: [phaseSchema],
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

roadmapSchema.index({ userId: 1, status: 1 });

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', roadmapSchema);
