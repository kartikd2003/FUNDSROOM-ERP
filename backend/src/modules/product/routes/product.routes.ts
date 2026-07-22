import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import StockController from '../controllers/stock.controller';
import ImportController from '../controllers/import.controller';
import ExportController from '../controllers/export.controller';
import ImageController from '../controllers/image.controller';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { csvUpload, productImageUpload } from '../middleware/upload.middleware';
import { authenticate } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, requirePermission('PRODUCT.CREATE'), validate(createProductSchema), ProductController.createProduct);
router.get('/', authenticate, requirePermission('PRODUCT.VIEW'), ProductController.getProducts);
router.get('/export', authenticate, requirePermission('PRODUCT.EXPORT'), ExportController.exportCSV);
router.post('/import', authenticate, requirePermission('PRODUCT.IMPORT'), csvUpload.single('file'), ImportController.importCSV);
router.get('/:id', authenticate, requirePermission('PRODUCT.VIEW'), ProductController.getProduct);
router.put('/:id', authenticate, requirePermission('PRODUCT.UPDATE'), validate(updateProductSchema), ProductController.updateProduct);
router.post('/:id/stock/in', authenticate, requirePermission('INVENTORY.STOCK_IN'), StockController.stockIn);
router.post('/:id/stock/out', authenticate, requirePermission('INVENTORY.STOCK_OUT'), StockController.stockOut);
router.post('/:id/image', authenticate, requirePermission('PRODUCT.UPLOAD_IMAGE'), productImageUpload.single('image'), ImageController.uploadImage);
router.delete('/:id', authenticate, requirePermission('PRODUCT.DELETE'), ProductController.deleteProduct);

export default router;
