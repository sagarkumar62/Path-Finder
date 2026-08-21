import { Router } from 'express';
import {
  generateRoadmap,
  getRoadmaps,
  getRoadmapById,
  updateRoadmap,
  deleteRoadmap,
} from '../controllers/roadmap.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/generate', generateRoadmap);
router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);
router.patch('/:id', updateRoadmap);
router.delete('/:id', deleteRoadmap);

export default router;
