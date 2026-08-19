import { Router } from 'express';
import {
  createRecommendation,
  getRecommendations,
  getRecommendationById,
  analyzeSkillGap,
  adaptRecommendation,
} from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createRecommendation);
router.get('/', getRecommendations);
router.get('/:id', getRecommendationById);
router.post('/skill-gap', analyzeSkillGap);
router.post('/adapt', adaptRecommendation);

export default router;
