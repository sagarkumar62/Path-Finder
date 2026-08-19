import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, default: 'General' },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);
