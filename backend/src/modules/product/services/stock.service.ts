import prisma from '../../../config/db';
import StockRepository from '../repositories/stock.repository';
import { AppError } from '../../../utils/AppError';
import { CreateStockMovementDTO, StockUpdateDTO } from '../interfaces/stock.interface';

class StockService {
  async createMovement(data: CreateStockMovementDTO) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const warehouse = await prisma.warehouse.findUnique({ where: { id: data.warehouseId } });
    if (!warehouse) {
      throw new AppError('Warehouse not found', 404);
    }

    return StockRepository.createMovement(data);
  }

  async getHistory(productId: number) {
    return StockRepository.getStockHistory(productId);
  }

  async getAllMovements() {
    return StockRepository.getAllMovements();
  }

  async increaseStock(productId: number, data: StockUpdateDTO) {
    return prisma.$transaction(async (tx: any) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const warehouse = await tx.warehouse.findUnique({ where: { id: data.warehouseId } });
      if (!warehouse) {
        throw new AppError('Warehouse not found', 404);
      }

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { currentStock: { increment: data.quantity } }
      });

      await tx.stockMovement.create({
        data: {
          productId,
          warehouseId: data.warehouseId,
          quantity: data.quantity,
          type: 'IN',
          reason: data.reason,
          userId: data.userId
        }
      });

      return updatedProduct;
    });
  }

  async decreaseStock(productId: number, data: StockUpdateDTO) {
    return prisma.$transaction(async (tx: any) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (product.currentStock < data.quantity) {
        throw new AppError('Insufficient stock', 400);
      }

      const warehouse = await tx.warehouse.findUnique({ where: { id: data.warehouseId } });
      if (!warehouse) {
        throw new AppError('Warehouse not found', 404);
      }

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { currentStock: { decrement: data.quantity } }
      });

      await tx.stockMovement.create({
        data: {
          productId,
          warehouseId: data.warehouseId,
          quantity: data.quantity,
          type: 'OUT',
          reason: data.reason,
          userId: data.userId
        }
      });

      return updatedProduct;
    });
  }
}

export default new StockService();
