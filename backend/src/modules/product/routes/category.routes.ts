import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, requirePermission('CATEGORY.CREATE'), validate(createCategorySchema), CategoryController.createCategory);
router.get('/', authenticate, requirePermission('CATEGORY.VIEW'), CategoryController.getCategories);
router.get('/:id', authenticate, requirePermission('CATEGORY.VIEW'), CategoryController.getCategory);
router.put('/:id', authenticate, requirePermission('CATEGORY.UPDATE'), validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', authenticate, requirePermission('CATEGORY.DELETE'), CategoryController.deleteCategory);

export default router;
