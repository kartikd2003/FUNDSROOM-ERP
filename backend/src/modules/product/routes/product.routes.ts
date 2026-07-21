import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import StockController from '../controllers/stock.controller';
import ImportController from '../controllers/import.controller';
import ExportController from '../controllers/export.controller';
import ImageController from '../controllers/image.controller';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { csvUpload, productImageUpload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', validate(createProductSchema), ProductController.createProduct);
router.get('/', ProductController.getProducts);
router.get('/export', ExportController.exportCSV);
router.post('/import', csvUpload.single('file'), ImportController.importCSV);
router.get('/:id', ProductController.getProduct);
router.put('/:id', validate(updateProductSchema), ProductController.updateProduct);
router.post('/:id/stock/in', StockController.stockIn);
router.post('/:id/stock/out', StockController.stockOut);
router.post('/:id/image', productImageUpload.single('image'), ImageController.uploadImage);
router.delete('/:id', ProductController.deleteProduct);

export default router;
