import { Router } from 'express';
import auditController from '../controllers/audit.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.get('/', authenticate, requirePermission('AUDIT.VIEW'), auditController.getLogs);

export default router;
