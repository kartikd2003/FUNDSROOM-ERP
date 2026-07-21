import prisma from '../../../config/db';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from '../interfaces/warehouse.interface';

class WarehouseRepository {
  async create(data: CreateWarehouseDTO) {
    return prisma.warehouse.create({ data });
  }

  async findAll() {
    return prisma.warehouse.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async findById(id: number) {
    return prisma.warehouse.findUnique({ where: { id }, include: { products: true } });
  }

  async findByName(name: string) {
    return prisma.warehouse.findUnique({ where: { name } });
  }

  async update(id: number, data: UpdateWarehouseDTO) {
    return prisma.warehouse.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.warehouse.delete({ where: { id } });
  }
}

export default new WarehouseRepository();
