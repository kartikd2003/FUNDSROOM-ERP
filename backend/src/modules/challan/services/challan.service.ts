import prisma from '../../../config/db';
import ChallanRepository from '../repositories/challan.repository';
import auditRepository from '../../product/repositories/audit.repository';
import { AppError } from '../../../utils/AppError';
import { CreateChallanDTO } from '../interfaces/challan.interface';

class ChallanService {
  private async generateChallanNumber() {
    const count = await ChallanRepository.count();
    const year = new Date().getFullYear();
    const seq = String(count + 1).padStart(5, '0');
    return `CH-${year}-${seq}`;
  }

  async createChallan(data: CreateChallanDTO, userId: string) {
    if (!data.items || data.items.length === 0) {
      throw new AppError('At least one product is required', 400);
    }

    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // Fetch product snapshots + validate existence
    const itemsWithSnapshot = [];
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new AppError('Quantity must be greater than zero', 400);
      }
      const product = await prisma.product.findFirst({
        where: { id: item.productId, deletedAt: null }
      });
      if (!product) {
        throw new AppError(`Product ID ${item.productId} not found`, 404);
      }
      itemsWithSnapshot.push({
        productId: product.id,
        productName: product.productName,
        sku: product.sku,
        unitPrice: product.unitPrice,
        quantity: item.quantity,
        warehouseId: product.warehouseId
      });
    }

    const challanNumber = await this.generateChallanNumber();
    const totalQuantity = itemsWithSnapshot.reduce((sum, i) => sum + i.quantity, 0);
    const requestedStatus = data.status === 'CONFIRMED' ? 'CONFIRMED' : 'DRAFT';

    // If confirming immediately, do stock validation + decrement in one transaction
    if (requestedStatus === 'CONFIRMED') {
      return this.createAndConfirm(challanNumber, data.customerId, itemsWithSnapshot, totalQuantity, userId);
    }

    // Otherwise just save as draft, no stock changes
    const challan = await ChallanRepository.create({
      challanNumber,
      customerId: data.customerId,
      status: 'DRAFT',
      totalQuantity,
      createdById: userId,
      items: { create: itemsWithSnapshot }
    });

    return challan;
  }

  private async createAndConfirm(
    challanNumber: string,
    customerId: string,
    items: any[],
    totalQuantity: number,
    userId: string
  ) {
    return prisma.$transaction(async (tx: any) => {
      // Validate stock for all items first
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product.currentStock < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${product.productName}". Available: ${product.currentStock}, Requested: ${item.quantity}`,
            400
          );
        }
      }

      const challan = await tx.challan.create({
        data: {
          challanNumber,
          customerId,
          status: 'CONFIRMED',
          totalQuantity,
          createdById: userId,
          confirmedAt: new Date(),
          items: { create: items }
        },
        include: { items: true }
      });

      // Decrement stock + write StockMovement + AuditLog for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            type: 'OUT',
            reason: `Sales Challan ${challanNumber}`,
            userId
          }
        });

        await tx.auditLog.create({
          data: {
            action: 'STOCK_UPDATE',
            productId: item.productId,
            newValue: { challanNumber, quantity: item.quantity, type: 'OUT' },
            userId
          }
        });
      }

      return challan;
    });
  }

  async getChallans(query: any) {
    return ChallanRepository.findAll(query);
  }

  async getChallan(id: number) {
    const challan = await ChallanRepository.findById(id);
    if (!challan) {
      throw new AppError('Challan not found', 404);
    }
    return challan;
  }

  async confirmChallan(id: number, userId: string) {
    const challan = await ChallanRepository.findById(id);
    if (!challan) {
      throw new AppError('Challan not found', 404);
    }
    if (challan.status !== 'DRAFT') {
      throw new AppError(`Cannot confirm a challan with status ${challan.status}`, 400);
    }

    return prisma.$transaction(async (tx: any) => {
      // Validate stock for all items
      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product.currentStock < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${item.productName}". Available: ${product.currentStock}, Requested: ${item.quantity}`,
            400
          );
        }
      }

      // Decrement stock + write movement + audit
      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            type: 'OUT',
            reason: `Sales Challan ${challan.challanNumber}`,
            userId
          }
        });

        await tx.auditLog.create({
          data: {
            action: 'STOCK_UPDATE',
            productId: item.productId,
            newValue: { challanNumber: challan.challanNumber, quantity: item.quantity, type: 'OUT' },
            userId
          }
        });
      }

      return tx.challan.update({
        where: { id },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
        include: { items: true }
      });
    });
  }

  async cancelChallan(id: number, userId: string) {
    const challan = await ChallanRepository.findById(id);
    if (!challan) {
      throw new AppError('Challan not found', 404);
    }
    if (challan.status === 'CANCELLED') {
      throw new AppError('Challan is already cancelled', 400);
    }

    // If it was confirmed, restore the stock that was deducted
    if (challan.status === 'CONFIRMED') {
      return prisma.$transaction(async (tx: any) => {
        for (const item of challan.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { currentStock: { increment: item.quantity } }
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              warehouseId: item.warehouseId,
              quantity: item.quantity,
              type: 'IN',
              reason: `Cancelled Challan ${challan.challanNumber}`,
              userId
            }
          });
        }

        return tx.challan.update({
          where: { id },
          data: { status: 'CANCELLED', cancelledAt: new Date() }
        });
      });
    }

    // If still DRAFT, just mark cancelled, no stock to restore
    return ChallanRepository.updateStatus(id, { status: 'CANCELLED', cancelledAt: new Date() });
  }
}

export default new ChallanService();