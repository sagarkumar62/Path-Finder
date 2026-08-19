import { Router, Request, Response } from 'express';
import { getDBState } from '../config/db';
import { aiConfig } from '../config/ai';
import axios from 'axios';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  const dbStatus = getDBState();
  let aiStatus = 'unavailable';

  if (aiConfig.mockMode) {
    aiStatus = 'healthy (mock mode)';
  } else {
    try {
      const response = await axios.get(`${aiConfig.baseUrl}${aiConfig.endpoints.health}`, {
        timeout: 2000,
      });
      if (response.status === 200) {
        aiStatus = 'healthy';
      }
    } catch (err) {
      aiStatus = 'unavailable';
    }
  }

  res.status(200).json({
    success: true,
    backend: 'healthy',
    database: dbStatus,
    aiService: aiStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
