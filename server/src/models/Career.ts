import mongoose, { Schema, Document } from 'mongoose';

export interface IRequiredSkill {
  skill: string;
  importance: number; // 0.0 - 1.0
}

export interface ICareerResource {
  title: string;
  type: string;
  url: string;
  isFree?: boolean;
}

export interface ICareerProject {
  title: string;
  description: string;
  difficulty?: string;
}

export interface ICareer extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  requiredSkills: IRequiredSkill[];
  recommendedSkills: IRequiredSkill[];
  learningResources: ICareerResource[];
  projects: ICareerProject[];
  estimatedMonths: number;
  averageSalary?: string;
  demandLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Technology' },
    requiredSkills: [
      {
        skill: { type: String, required: true },
        importance: { type: Number, required: true, min: 0, max: 1 },
      },
    ],
    recommendedSkills: [
      {
        skill: { type: String, required: true },
        importance: { type: Number, required: true, min: 0, max: 1 },
      },
    ],
    learningResources: [
      {
        title: { type: String, required: true },
        type: { type: String, default: 'Course' },
        url: { type: String, default: '' },
        isFree: { type: Boolean, default: true },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, default: 'Intermediate' },
      },
    ],
    estimatedMonths: { type: Number, default: 6 },
    averageSalary: { type: String, default: '$90,000 - $140,000' },
    demandLevel: { type: String, default: 'High' },
  },
  {
    timestamps: true,
  }
);

export const Career = mongoose.model<ICareer>('Career', careerSchema);
