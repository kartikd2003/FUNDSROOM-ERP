import prisma from '../../../config/db';

class AnalyticsRepository {
  async inventoryValue() {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      select: { unitPrice: true, currentStock: true }
    });
    return products.reduce((sum, item) => sum + Number(item.unitPrice) * item.currentStock, 0);
  }

  async mostStocked() {
    return prisma.product.findFirst({
      where: { deletedAt: null },
      orderBy: { currentStock: 'desc' },
      select: { productName: true, currentStock: true, sku: true }
    });
  }

  async leastStocked() {
    return prisma.product.findFirst({
      where: { deletedAt: null },
      orderBy: { currentStock: 'asc' },
      select: { productName: true, currentStock: true, sku: true }
    });
  }

  async lowStockProducts() {
    const lowStockProducts = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM Product WHERE currentStock <= minimumStock AND deletedAt IS NULL
    `;
    const ids = lowStockProducts.map(p => p.id);
    if (ids.length === 0) return [];

    return prisma.product.findMany({
      where: { id: { in: ids } },
      select: { productName: true, currentStock: true, minimumStock: true, sku: true },
      orderBy: { currentStock: 'asc' }
    });
  }

  async outOfStockProducts() {
    return prisma.product.findMany({
      where: { currentStock: 0, deletedAt: null },
      select: { productName: true, currentStock: true, sku: true }
    });
  }

  async categoryReport() {
    return prisma.category.findMany({
      select: {
        name: true,
        _count: { select: { products: { where: { deletedAt: null } } } }
      }
    });
  }
}

export default new AnalyticsRepository();

