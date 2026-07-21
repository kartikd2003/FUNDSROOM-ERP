import prisma from '../../../config/db';

class ImportRepository {
  async createProducts(products: any[]) {
    return prisma.product.createMany({
      data: products,
      skipDuplicates: true
    });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }
}

export default new ImportRepository();

