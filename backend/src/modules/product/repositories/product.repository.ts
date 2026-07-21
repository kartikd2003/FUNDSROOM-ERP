import prisma from '../../../config/db';
import { CreateProductDTO, ProductQuery, UpdateProductDTO } from '../interfaces/product.interface';

class ProductRepository {
  async create(data: CreateProductDTO) {
    return prisma.product.create({ data });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  async findAll(query: ProductQuery) {
    const page = Number(query.page) || 1;
    let limit = Number(query.limit) || 20;

    // Validate limit to allowed values: 20, 50, 100
    const allowedLimits = [20, 50, 100];
    if (!allowedLimits.includes(limit)) {
      limit = 20;
    }

    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { productName: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { category: { name: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.warehouseId) where.warehouseId = Number(query.warehouseId);

    if (query.minPrice || query.maxPrice) {
      where.unitPrice = {};
      if (query.minPrice) where.unitPrice.gte = Number(query.minPrice);
      if (query.maxPrice) where.unitPrice.lte = Number(query.maxPrice);
    }

    // LOW stock filter: products where currentStock <= minimumStock
    if (query.stockStatus === 'LOW') {
      const lowStockProducts = await prisma.$queryRaw<Array<{ id: number }>>`
        SELECT id FROM Product WHERE currentStock <= minimumStock AND deletedAt IS NULL
      `;
      const lowStockIds = lowStockProducts.map((p: { id: number }) => p.id);
      where.id = { in: lowStockIds };
    }

    if (query.stockStatus === 'OUT') {
      where.currentStock = 0;
    }

    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    const [products, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: { category: true, warehouse: true }
      }),
      prisma.product.count({ where })
    ]);

    return {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: products
    };
  }

  async findById(id: number) {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, warehouse: true }
    });
  }

  async update(id: number, data: UpdateProductDTO) {
    return prisma.product.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export default new ProductRepository();
