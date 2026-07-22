import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.get('/', authenticate, requirePermission('INVENTORY.ANALYTICS'), analyticsController.getAnalytics);

export default router;
