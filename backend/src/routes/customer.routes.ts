import { Router } from 'express';
import CustomerController from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, CustomerController.createCustomer);
router.get('/', authenticate, CustomerController.getCustomers);
router.get('/:id/details', authenticate, CustomerController.getCustomerDetails);
router.get('/:id', authenticate, CustomerController.getCustomerById);
router.put('/:id', authenticate, CustomerController.updateCustomer);
router.delete('/:id', authenticate, CustomerController.deleteCustomer);
router.patch('/:id/restore', authenticate, CustomerController.restoreCustomer);
router.patch('/:id/status', authenticate, CustomerController.updateStatus);
router.post('/:id/followup', authenticate, CustomerController.addFollowUp);

export default router;
