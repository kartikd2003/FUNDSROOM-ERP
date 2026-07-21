import { Router } from 'express';
import StockController from '../controllers/stock.controller';
import { validate } from '../middleware/validate.middleware';
import { stockMovementSchema } from '../validators/stock.validator';

const router = Router();

router.get('/', StockController.getAllMovements);
router.post('/', validate(stockMovementSchema), StockController.createMovement);
router.get('/:productId/history', StockController.stockHistory);

export default router;
