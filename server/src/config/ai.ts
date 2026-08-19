import { env } from './env';

export const aiConfig = {
  baseUrl: env.AI_SERVICE_URL,
  timeout: env.AI_SERVICE_TIMEOUT,
  mockMode: env.AI_MOCK_MODE,
  endpoints: {
    health: '/health',
    recommend: '/recommend',
    skillGap: '/skill-gap',
    roadmap: '/roadmap',
    adapt: '/adapt',
    assistant: '/assistant',
  },
};
