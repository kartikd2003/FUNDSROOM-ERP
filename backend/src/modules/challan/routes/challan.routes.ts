import { Router } from 'express';
import ChallanController from '../controllers/challan.controller';
import { validate } from '../../product/middleware/validate.middleware';
import { createChallanSchema } from '../validators/challan.validator';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, requirePermission('SALES.CREATE'), validate(createChallanSchema), ChallanController.createChallan);
router.get('/', authenticate, requirePermission('SALES.VIEW'), ChallanController.getChallans);
router.get('/:id', authenticate, requirePermission('SALES.VIEW'), ChallanController.getChallan);
router.patch('/:id/confirm', authenticate, requirePermission('SALES.CONFIRM'), ChallanController.confirmChallan);
router.patch('/:id/cancel', authenticate, requirePermission('SALES.CANCEL'), ChallanController.cancelChallan);

export default router;
