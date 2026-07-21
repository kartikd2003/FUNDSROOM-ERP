import CategoryRepository from '../repositories/category.repository';
import { AppError } from '../../../utils/AppError';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../interfaces/category.interface';
import prisma from '../../../config/db';

class CategoryService {
  async createCategory(data: CreateCategoryDTO) {
    const existing = await CategoryRepository.findByName(data.name);
    if (existing) {
      throw new AppError('Category already exists', 409);
    }

    return CategoryRepository.create(data);
  }

  async getCategories() {
    return CategoryRepository.findAll();
  }

  async getCategory(id: number) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async updateCategory(id: number, data: UpdateCategoryDTO) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.name && data.name !== category.name) {
      const existing = await CategoryRepository.findByName(data.name);
      if (existing) {
        throw new AppError('Category already exists', 409);
      }
    }

    return CategoryRepository.update(id, data);
  }

  async deleteCategory(id: number) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const products = await prisma.product.count({ where: { categoryId: id, deletedAt: null } });
    if (products > 0) {
      throw new AppError('Cannot delete category. Products exist.', 400);
    }

    return CategoryRepository.delete(id);
  }
}

export default new CategoryService();
