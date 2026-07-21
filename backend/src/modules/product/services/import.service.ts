import prisma from '../../../config/db';
import { parseCSV } from '../utils/csv.helper';
import importRepository from '../repositories/import.repository';

class ImportService {
  async importProducts(filePath: string) {
    const products: any[] = await parseCSV(filePath);
    const success: any[] = [];
    const failed: any[] = [];

    for (const product of products) {
      const existingSKU = await importRepository.findBySku(product.sku);
      if (existingSKU) {
        failed.push({ sku: product.sku, reason: 'Duplicate SKU' });
        continue;
      }

      // Validate category exists
      const category = await prisma.category.findUnique({ where: { id: Number(product.categoryId) } });
      if (!category) {
        failed.push({ sku: product.sku, reason: 'Category not found' });
        continue;
      }

      // Validate warehouse exists
      const warehouse = await prisma.warehouse.findUnique({ where: { id: Number(product.warehouseId) } });
      if (!warehouse) {
        failed.push({ sku: product.sku, reason: 'Warehouse not found' });
        continue;
      }

      success.push({
        productName: product.productName,
        sku: product.sku,
        categoryId: Number(product.categoryId),
        warehouseId: Number(product.warehouseId),
        unitPrice: Number(product.unitPrice),
        currentStock: Number(product.currentStock) || 0,
        minimumStock: Number(product.minimumStock) || 0
      });
    }

    if (success.length > 0) {
      await importRepository.createProducts(success);
    }

    return {
      imported: success.length,
      failed: failed.length,
      errors: failed
    };
  }
}

export default new ImportService();

