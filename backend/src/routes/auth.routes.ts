import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/role.middleware';

const router = Router();

router.post(
  '/register',
  authenticate,
  requirePermission('USER.CREATE'),
  [
    body('fullName').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').notEmpty().withMessage('Role is required')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
);

router.get('/profile', authenticate, authController.profile);
router.put('/change-password', authenticate, authController.changePassword);

export default router;
