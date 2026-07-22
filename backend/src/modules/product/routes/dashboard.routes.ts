import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.get('/summary', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getSummary);
router.get('/category-stock', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getCategoryStock);
router.get('/stock-movement', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getStockMovement);
router.get('/activity', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getRecentActivity);
router.get('/low-stock', authenticate, requirePermission('DASHBOARD.VIEW'), dashboardController.getLowStockProducts);

export default router;
