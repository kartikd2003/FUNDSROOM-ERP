import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.get('/summary', dashboardController.getSummary);
router.get('/category-stock', dashboardController.getCategoryStock);
router.get('/stock-movement', dashboardController.getStockMovement);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/low-stock', dashboardController.getLowStockProducts);

export default router;

