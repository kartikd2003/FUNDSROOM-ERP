import prisma from '../../../config/db';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../interfaces/category.interface';

class CategoryRepository {
  async create(data: CreateCategoryDTO) {
    return prisma.category.create({ data });
  }

  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async findById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  }

  async update(id: number, data: UpdateCategoryDTO) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}

export default new CategoryRepository();
