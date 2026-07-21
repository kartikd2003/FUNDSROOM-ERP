import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.post('/', validate(createCategorySchema), CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.put('/:id', validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
