import prisma from '../../../config/db';
import { CreateStockMovementDTO } from '../interfaces/stock.interface';

class StockRepository {
  async createMovement(data: CreateStockMovementDTO) {
    return prisma.stockMovement.create({ data });
  }

  async getStockHistory(productId: number) {
    return prisma.stockMovement.findMany({
      where: { productId },
      include: { warehouse: true, product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllMovements() {
    return prisma.stockMovement.findMany({
      include: { product: true, warehouse: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default new StockRepository();
