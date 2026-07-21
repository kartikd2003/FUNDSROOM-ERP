import WarehouseRepository from '../repositories/warehouse.repository';
import { AppError } from '../../../utils/AppError';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from '../interfaces/warehouse.interface';
import prisma from '../../../config/db';

class WarehouseService {
  async createWarehouse(data: CreateWarehouseDTO) {
    const existing = await WarehouseRepository.findByName(data.name);
    if (existing) {
      throw new AppError('Warehouse already exists', 409);
    }

    return WarehouseRepository.create(data);
  }

  async getWarehouses() {
    return WarehouseRepository.findAll();
  }

  async getWarehouse(id: number) {
    const warehouse = await WarehouseRepository.findById(id);
    if (!warehouse) {
      throw new AppError('Warehouse not found', 404);
    }
    return warehouse;
  }

  async updateWarehouse(id: number, data: UpdateWarehouseDTO) {
    const warehouse = await WarehouseRepository.findById(id);
    if (!warehouse) {
      throw new AppError('Warehouse not found', 404);
    }

    if (data.name && data.name !== warehouse.name) {
      const existing = await WarehouseRepository.findByName(data.name);
      if (existing) {
        throw new AppError('Warehouse already exists', 409);
      }
    }

    return WarehouseRepository.update(id, data);
  }

  async deleteWarehouse(id: number) {
    const warehouse = await WarehouseRepository.findById(id);
    if (!warehouse) {
      throw new AppError('Warehouse not found', 404);
    }

    const productCount = await prisma.product.count({ where: { warehouseId: id, deletedAt: null } });
    if (productCount > 0) {
      throw new AppError('Cannot delete warehouse. Products exist.', 400);
    }

    return WarehouseRepository.delete(id);
  }
}

export default new WarehouseService();
