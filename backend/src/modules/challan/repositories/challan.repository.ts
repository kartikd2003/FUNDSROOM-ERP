import prisma from '../../../config/db';

class ChallanRepository {
  async count() {
    return prisma.challan.count();
  }

  async create(data: any) {
    return prisma.challan.create({
      data,
      include: { items: true, customer: true }
    });
  }

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.customerId) where.customerId = query.customerId;

    const [challans, totalRecords] = await prisma.$transaction([
      prisma.challan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { customerName: true, businessName: true } },
          items: true
        }
      }),
      prisma.challan.count({ where })
    ]);

    return {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: challans
    };
  }

  async findById(id: number) {
    return prisma.challan.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true, warehouse: true } },
        createdBy: { select: { fullName: true, email: true } }
      }
    });
  }

  async updateStatus(id: number, data: any) {
    return prisma.challan.update({ where: { id }, data });
  }
}

export default new ChallanRepository();