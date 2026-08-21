import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface GeminiMessage {
  role: 'user' | 'assistant' | 'system' | 'model';
  content: string;
}

export class GeminiService {
  private primaryModel = env.GEMINI_MODEL || 'gemini-3.6-flash';
  private fallbackModel = 'gemini-3.5-flash';

  async generateResponseStream(
    systemInstruction: string,
    history: GeminiMessage[],
    userMessage: string,
    onChunk: (textChunk: string) => void
  ): Promise<string> {
    const apiKey = env.GEMINI_API_KEY || env.LLM_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'GEMINI_API_KEY is not configured in server environment variables. Please set a valid GEMINI_API_KEY in .env.'
      );
    }

    const modelsToTry = Array.from(
      new Set([this.primaryModel, this.fallbackModel, 'gemini-3.6-flash', 'gemini-3.5-flash'])
    );

    let lastErrorDetails = '';

    // 1. Try SDK generateContentStream
    try {
      const ai = new GoogleGenAI({ apiKey });

      for (const model of modelsToTry) {
        try {
          logger.info(`[GeminiService] Calling GoogleGenAI generateContentStream with model: ${model}`);

          const contents: any[] = [];
          for (const msg of history) {
            const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
            if (msg.content && msg.content.trim()) {
              contents.push({
                role,
                parts: [{ text: msg.content.trim() }],
              });
            }
          }

          const lastMsg = contents[contents.length - 1];
          if (!lastMsg || lastMsg.role !== 'user' || lastMsg.parts[0]?.text !== userMessage.trim()) {
            contents.push({
              role: 'user',
              parts: [{ text: userMessage.trim() }],
            });
          }

          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          });

          let fullText = '';
          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              fullText += chunkText;
              onChunk(chunkText);
            }
          }

          if (fullText.trim().length > 0) {
            logger.info(`[GeminiService] Real-time stream successfully completed by SDK (${model}).`);
            return fullText.trim();
          }
        } catch (sdkStreamError: any) {
          const errMsg = sdkStreamError?.message || String(sdkStreamError);
          lastErrorDetails = `SDK Stream ${model}: ${errMsg}`;
          logger.warn(`[GeminiService] SDK stream attempt with ${model} failed: ${errMsg}`);
        }
      }
    } catch (sdkInitError: any) {
      logger.warn(`[GeminiService] SDK init failed for stream (${sdkInitError.message}).`);
    }

    // Fallback to standard generateResponse if streaming fails
    const fullText = await this.generateResponse(systemInstruction, history, userMessage);
    onChunk(fullText);
    return fullText;
  }

  async generateResponse(
    systemInstruction: string,
    history: GeminiMessage[],
    userMessage: string
  ): Promise<string> {
    const apiKey = env.GEMINI_API_KEY || env.LLM_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'GEMINI_API_KEY is not configured in server environment variables. Please set a valid GEMINI_API_KEY in .env.'
      );
    }

    const modelsToTry = Array.from(
      new Set([this.primaryModel, this.fallbackModel, 'gemini-3.6-flash', 'gemini-3.5-flash'])
    );

    let lastErrorDetails = '';

    // 1. Try using official GoogleGenAI SDK
    try {
      const ai = new GoogleGenAI({ apiKey });

      for (const model of modelsToTry) {
        try {
          logger.info(`[GeminiService] Calling GoogleGenAI SDK with model: ${model}`);

          // Construct contents for SDK
          const contents: any[] = [];

          // Add history
          for (const msg of history) {
            const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
            if (msg.content && msg.content.trim()) {
              contents.push({
                role,
                parts: [{ text: msg.content.trim() }],
              });
            }
          }

          // Ensure latest user message is at the end
          const lastMsg = contents[contents.length - 1];
          if (!lastMsg || lastMsg.role !== 'user' || lastMsg.parts[0]?.text !== userMessage.trim()) {
            contents.push({
              role: 'user',
              parts: [{ text: userMessage.trim() }],
            });
          }

          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          });

          if (response?.text && typeof response.text === 'string' && response.text.trim().length > 0) {
            logger.info(`[GeminiService] Real-time response successfully generated by SDK (${model}).`);
            return response.text.trim();
          }
        } catch (sdkModelError: any) {
          const errMsg = sdkModelError?.message || String(sdkModelError);
          lastErrorDetails = `SDK Model ${model}: ${errMsg}`;
          logger.warn(`[GeminiService] SDK attempt with ${model} failed: ${errMsg}`);
        }
      }
    } catch (sdkInitError: any) {
      logger.warn(`[GeminiService] SDK init failed (${sdkInitError.message}). Trying direct REST endpoint.`);
    }

    // 2. Fallback to direct REST API if SDK call fails
    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const contents: any[] = [
          {
            role: 'user',
            parts: [{ text: `[SYSTEM INSTRUCTION & MENTOR PERSONA]\n${systemInstruction}` }],
          },
          {
            role: 'model',
            parts: [
              {
                text: 'Understood. I am your AI Career Mentor. I have loaded your learner profile, skills, education, roadmap, and goals, and I am ready to provide real-time, personalized guidance.',
              },
            ],
          },
        ];

        for (const msg of history) {
          const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
          if (msg.content && msg.content.trim()) {
            contents.push({
              role,
              parts: [{ text: msg.content.trim() }],
            });
          }
        }

        const lastMsg = contents[contents.length - 1];
        if (!lastMsg || lastMsg.role !== 'user' || lastMsg.parts[0]?.text !== userMessage.trim()) {
          contents.push({
            role: 'user',
            parts: [{ text: userMessage.trim() }],
          });
        }

        const requestBody = {
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
          },
        };

        logger.info(`[GeminiService] Fallback REST request to Gemini model: ${model}`);
        const response = await axios.post(url, requestBody, { timeout: 25000 });
        const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && typeof candidateText === 'string' && candidateText.trim().length > 0) {
          logger.info(`[GeminiService] Real-time response successfully generated by REST (${model}).`);
          return candidateText.trim();
        }
      } catch (restError: any) {
        const status = restError.response?.status;
        const errMessage = restError.response?.data?.error?.message || restError.message || 'Unknown REST API error';
        lastErrorDetails = `REST Model ${model} (HTTP ${status || 'Network'}): ${errMessage}`;
        logger.warn(`[GeminiService] REST attempt with model ${model} failed: ${lastErrorDetails}`);
      }
    }

    throw new Error(`Google Gemini API Error: ${lastErrorDetails}`);
  }
}

export const geminiService = new GeminiService();
