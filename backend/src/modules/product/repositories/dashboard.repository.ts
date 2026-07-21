import prisma from '../../../config/db';

class DashboardRepository {
  async getTotalProducts() {
    return prisma.product.count({ where: { deletedAt: null } });
  }

  async getTotalCategories() {
    return prisma.category.count();
  }

  async getTotalWarehouses() {
    return prisma.warehouse.count();
  }

  async getInventoryValue() {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      select: { unitPrice: true, currentStock: true }
    });
    return products.reduce((total, p) => total + Number(p.unitPrice) * p.currentStock, 0);
  }

  async getLowStockCount() {
    const lowStockProducts = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM Product WHERE currentStock <= minimumStock AND deletedAt IS NULL
    `;
    return lowStockProducts.length;
  }

  async getOutOfStockCount() {
    return prisma.product.count({ where: { currentStock: 0, deletedAt: null } });
  }

  async getCategoryStock() {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        products: {
          where: { deletedAt: null },
          select: { currentStock: true }
        }
      }
    });
    return categories.map(c => ({
      category: c.name,
      stock: c.products.reduce((sum, p) => sum + p.currentStock, 0)
    }));
  }

  async getMonthlyStockMovement() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const movements = await prisma.stockMovement.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { type: true, quantity: true, createdAt: true }
    });

    const months: Record<string, { IN: number; OUT: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const m of movements) {
      const monthKey = monthNames[m.createdAt.getMonth()] + ' ' + m.createdAt.getFullYear();
      if (!months[monthKey]) months[monthKey] = { IN: 0, OUT: 0 };
      if (m.type === 'IN') months[monthKey].IN += m.quantity;
      else months[monthKey].OUT += m.quantity;
    }

    return Object.entries(months).map(([month, data]) => ({
      month,
      IN: data.IN,
      OUT: data.OUT
    }));
  }

  async getRecentActivity() {
    const movements = await prisma.stockMovement.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { productName: true } },
        warehouse: { select: { name: true } }
      }
    });

    return movements.map(m => {
      const now = new Date();
      const diffMs = now.getTime() - m.createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let time: string;
      if (diffMins < 60) time = `${diffMins} minutes ago`;
      else if (diffMins < 1440) time = `${Math.floor(diffMins / 60)} hours ago`;
      else time = `${Math.floor(diffMins / 1440)} days ago`;

      return {
        action: m.type === 'IN' ? 'Stock Added' : 'Stock Removed',
        product: m.product.productName,
        warehouse: m.warehouse.name,
        quantity: m.quantity,
        type: m.type,
        time
      };
    });
  }

  async getLowStockProducts() {
    const lowStockProducts = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM Product WHERE currentStock <= minimumStock AND deletedAt IS NULL
    `;
    const ids = lowStockProducts.map(p => p.id);
    if (ids.length === 0) return [];

    return prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        productName: true,
        currentStock: true,
        minimumStock: true,
        sku: true
      },
      orderBy: { currentStock: 'asc' }
    });
  }
}

export default new DashboardRepository();

