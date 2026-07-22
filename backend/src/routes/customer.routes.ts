import { Router } from 'express';
import CustomerController from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, requirePermission('CUSTOMER.CREATE'), CustomerController.createCustomer);
router.get('/', authenticate, requirePermission('CUSTOMER.VIEW'), CustomerController.getCustomers);
router.get('/:id/details', authenticate, requirePermission('CUSTOMER.VIEW'), CustomerController.getCustomerDetails);
router.get('/:id', authenticate, requirePermission('CUSTOMER.VIEW'), CustomerController.getCustomerById);
router.put('/:id', authenticate, requirePermission('CUSTOMER.UPDATE'), CustomerController.updateCustomer);
router.delete('/:id', authenticate, requirePermission('CUSTOMER.DELETE'), CustomerController.deleteCustomer);
router.patch('/:id/restore', authenticate, requirePermission('CUSTOMER.RESTORE'), CustomerController.restoreCustomer);
router.patch('/:id/status', authenticate, requirePermission('CUSTOMER.UPDATE'), CustomerController.updateStatus);
router.post('/:id/followup', authenticate, requirePermission('CUSTOMER.UPDATE'), CustomerController.addFollowUp);

export default router;
