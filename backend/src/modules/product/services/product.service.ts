import ProductRepository from '../repositories/product.repository';
import { AppError } from '../../../utils/AppError';
import { CreateProductDTO, ProductQuery, UpdateProductDTO } from '../interfaces/product.interface';
import prisma from '../../../config/db';

class ProductService {
  async createProduct(data: CreateProductDTO) {
    const existingSku = await ProductRepository.findBySku(data.sku);
    if (existingSku) {
      throw new AppError('SKU already exists', 409);
    }

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new AppError('Category does not exist', 404);
    }

    const warehouse = await prisma.warehouse.findUnique({ where: { id: data.warehouseId } });
    if (!warehouse) {
      throw new AppError('Warehouse does not exist', 404);
    }

    return ProductRepository.create(data);
  }

  async getProducts(query: ProductQuery) {
    return ProductRepository.findAll(query);
  }

  async getProduct(id: number) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async updateProduct(id: number, data: UpdateProductDTO) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await ProductRepository.findBySku(data.sku);
      if (existingSku) {
        throw new AppError('SKU already exists', 409);
      }
    }

    return ProductRepository.update(id, data);
  }

  async deleteProduct(id: number) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return ProductRepository.softDelete(id);
  }
}

export default new ProductService();
