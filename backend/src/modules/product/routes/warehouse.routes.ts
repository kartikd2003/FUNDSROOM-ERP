import { Router } from 'express';
import WarehouseController from '../controllers/warehouse.controller';
import { validate } from '../middleware/validate.middleware';
import { createWarehouseSchema, updateWarehouseSchema } from '../validators/warehouse.validator';

const router = Router();

router.post('/', validate(createWarehouseSchema), WarehouseController.createWarehouse);
router.get('/', WarehouseController.getWarehouses);
router.get('/:id', WarehouseController.getWarehouse);
router.put('/:id', validate(updateWarehouseSchema), WarehouseController.updateWarehouse);
router.delete('/:id', WarehouseController.deleteWarehouse);

export default router;
