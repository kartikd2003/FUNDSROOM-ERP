import { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import dashboardRoutes from '../modules/dashboard/routes/dashboard.routes';
import inventoryDashboardRoutes from '../modules/product/routes/dashboard.routes';
import productRoutes from '../modules/product/routes/product.routes';
import categoryRoutes from '../modules/product/routes/category.routes';
import warehouseRoutes from '../modules/product/routes/warehouse.routes';
import stockRoutes from '../modules/product/routes/stock.routes';
import analyticsRoutes from '../modules/product/routes/analytics.routes';
import auditRoutes from '../modules/product/routes/audit.routes';
import challanRoutes from '../modules/challan/routes/challan.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/inventory-dashboard', inventoryDashboardRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/stock', stockRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit', auditRoutes);
router.use('/challans', challanRoutes);

export default router;
