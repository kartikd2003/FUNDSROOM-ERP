import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.get('/', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getDashboardStats);

export default router;
