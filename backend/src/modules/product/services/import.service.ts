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

      // Look up category by name
      const category = await prisma.category.findUnique({ where: { name: product.category } });
      if (!category) {
        failed.push({ sku: product.sku, reason: `Category "${product.category}" not found` });
        continue;
      }

      // Look up warehouse by name
      const warehouse = await prisma.warehouse.findUnique({ where: { name: product.warehouse } });
      if (!warehouse) {
        failed.push({ sku: product.sku, reason: `Warehouse "${product.warehouse}" not found` });
        continue;
      }

      success.push({
        productName: product.productName,
        sku: product.sku,
        categoryId: category.id,
        warehouseId: warehouse.id,
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
