import { Router } from 'express';
import WarehouseController from '../controllers/warehouse.controller';
import { validate } from '../middleware/validate.middleware';
import { createWarehouseSchema, updateWarehouseSchema } from '../validators/warehouse.validator';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, requirePermission('WAREHOUSE.CREATE'), validate(createWarehouseSchema), WarehouseController.createWarehouse);
router.get('/', authenticate, requirePermission('WAREHOUSE.VIEW'), WarehouseController.getWarehouses);
router.get('/:id', authenticate, requirePermission('WAREHOUSE.VIEW'), WarehouseController.getWarehouse);
router.put('/:id', authenticate, requirePermission('WAREHOUSE.UPDATE'), validate(updateWarehouseSchema), WarehouseController.updateWarehouse);
router.delete('/:id', authenticate, requirePermission('WAREHOUSE.DELETE'), WarehouseController.deleteWarehouse);

export default router;
