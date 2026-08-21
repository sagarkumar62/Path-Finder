import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender?: 'user' | 'assistant';
  role: 'user' | 'assistant' | 'system';
  message?: string;
  content: string;
  suggestedActions?: string[];
  relatedSkills?: string[];
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ['user', 'assistant'] },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    default: function (this: any) {
      return this.sender === 'user' ? 'user' : 'assistant';
    },
  },
  message: { type: String },
  content: {
    type: String,
    default: function (this: any) {
      return this.message || '';
    },
  },
  suggestedActions: { type: [String], default: [] },
  relatedSkills: { type: [String], default: [] },
  metadata: { type: Schema.Types.Mixed, default: {} },
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
    title: { type: String, default: 'New Career Chat' },
    messages: [messageSchema],
    context: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
