import { $Enums } from '@prisma/client';
import prisma from '../config/db';

class CustomerRepository {
  async create(data: any) {
    return prisma.customer.create({ data });
  }

  async findByMobile(mobile: string) {
    return prisma.customer.findUnique({ where: { mobile } });
  }

  async findByEmail(email: string) {
    return prisma.customer.findUnique({ where: { email } });
  }

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (query.search) {
      // MySQL handles case-insensitive search by default with proper collation
      where.OR = [
        { customerName: { contains: query.search } },
        { businessName: { contains: query.search } },
        { mobile: { contains: query.search } },
        { email: { contains: query.search } }
      ];
    }

    if (query.status) where.status = query.status;
    if (query.customerType) where.customerType = query.customerType;

    const orderBy: any = {};
    orderBy[query.sortBy || 'createdAt'] = query.order || 'desc';

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({ where, skip, take: limit, orderBy }),
      prisma.customer.count({ where })
    ]);

    return {
      customers,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      }
    };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({ where: { id } });
  }

  async getCustomerDetails(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        followUps: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true }
            }
          }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.customer.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: $Enums.CustomerStatus.INACTIVE
      }
    });
  }

  async restore(id: string) {
    return prisma.customer.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        status: $Enums.CustomerStatus.ACTIVE
      }
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.customer.update({ where: { id }, data: { status: status as $Enums.CustomerStatus } });
  }
}

export default new CustomerRepository();
