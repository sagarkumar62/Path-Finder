import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender: 'user' | 'assistant';
  message: string;
  suggestedActions?: string[];
  relatedSkills?: string[];
  timestamp: Date;
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
  suggestedActions: { type: [String], default: [] },
  relatedSkills: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messages: [messageSchema],
    context: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, createdAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
