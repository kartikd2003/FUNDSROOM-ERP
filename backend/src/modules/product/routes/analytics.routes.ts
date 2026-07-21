import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/', analyticsController.getAnalytics);

export default router;

