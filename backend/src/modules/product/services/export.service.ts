import prisma from '../../../config/db';
import { Parser } from 'json2csv';

class ExportService {
  async exportProducts() {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: { select: { name: true } },
        warehouse: { select: { name: true } }
      }
    });

    const data = products.map(p => ({
      productName: p.productName,
      sku: p.sku,
      category: p.category.name,
      warehouse: p.warehouse.name,
      unitPrice: Number(p.unitPrice),
      currentStock: p.currentStock,
      minimumStock: p.minimumStock
    }));

    const fields = ['productName', 'sku', 'category', 'warehouse', 'unitPrice', 'currentStock', 'minimumStock'];
    const parser = new Parser({ fields });
    return parser.parse(data); // works even when data is []
  }

}

export default new ExportService();

