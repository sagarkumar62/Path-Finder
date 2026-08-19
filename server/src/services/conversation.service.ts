import { Conversation, IConversation, IMessage } from '../models/Conversation';
import { LearnerProfile } from '../models/LearnerProfile';
import { aiService } from './ai.service';

export class ConversationService {
  async sendMessage(userId: string, userMessage: string, customContext?: Record<string, any>) {
    let conversation = await Conversation.findOne({ userId }).sort({ createdAt: -1 });

    const profile = await LearnerProfile.findOne({ userId });

    const combinedContext = {
      currentCareer: profile?.targetCareer || 'AI Engineer',
      currentSkills: profile?.skills || [],
      experienceLevel: profile?.experienceLevel || 'Beginner',
      weeklyLearningHours: profile?.weeklyLearningHours || 10,
      ...customContext,
    };

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        messages: [],
        context: combinedContext,
      });
    } else {
      conversation.context = { ...conversation.context, ...combinedContext };
    }

    const userMsgObj: IMessage = {
      sender: 'user',
      message: userMessage,
      timestamp: new Date(),
    };

    conversation.messages.push(userMsgObj);
    await conversation.save();

    // Generate AI response
    const aiResponse = await aiService.generateAssistantResponse({
      userId,
      message: userMessage,
      context: combinedContext,
    });

    const assistantMsgObj: IMessage = {
      sender: 'assistant',
      message: aiResponse.answer || "I'm here to assist you with your career roadmap!",
      suggestedActions: aiResponse.suggestedActions || [],
      relatedSkills: aiResponse.relatedSkills || [],
      timestamp: new Date(),
    };

    conversation.messages.push(assistantMsgObj);
    await conversation.save();

    return {
      conversation,
      reply: assistantMsgObj,
    };
  }

  async getConversation(userId: string): Promise<IConversation> {
    let conversation = await Conversation.findOne({ userId }).sort({ createdAt: -1 });
    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        messages: [
          {
            sender: 'assistant',
            message: 'Hello! I am your AI Career Assistant. How can I help guide your learning path today?',
            suggestedActions: [
              'Ask for career recommendations',
              'Check skill gaps for my target career',
              'Get help with current milestone',
            ],
            timestamp: new Date(),
          },
        ],
      });
    }
    return conversation;
  }
}

export const conversationService = new ConversationService();
