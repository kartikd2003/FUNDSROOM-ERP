import { Router } from 'express';
import StockController from '../controllers/stock.controller';
import { validate } from '../middleware/validate.middleware';
import { stockMovementSchema } from '../validators/stock.validator';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.get('/', authenticate, requirePermission('INVENTORY.MOVEMENT.VIEW'), StockController.getAllMovements);
router.post('/', authenticate, requirePermission('INVENTORY.STOCK_IN'), validate(stockMovementSchema), StockController.createMovement);
router.get('/:productId/history', authenticate, requirePermission('INVENTORY.MOVEMENT.VIEW'), StockController.stockHistory);

export default router;
