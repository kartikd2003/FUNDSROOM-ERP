import prisma from '../../../config/db';

class AuditRepository {
  async createAudit(data: {
    action: string;
    entityType: string;
    entityId: number;
    description?: string;
    userId?: number;
  }) {
    return prisma.auditLog.create({ data: data as any });
  }

  async getAuditLogs() {
    return prisma.auditLog.findMany({
      include: {
        product: { select: { productName: true, sku: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getEntityAudit(entityId: number) {
    return prisma.auditLog.findMany({
      where: { productId: entityId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default new AuditRepository();

