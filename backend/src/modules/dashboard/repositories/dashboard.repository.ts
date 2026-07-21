import prisma from '../../../config/db';

class DashboardRepository {
  async getCounts() {
    const total = await prisma.customer.count({ where: { isDeleted: false } });
    const active = await prisma.customer.count({ where: { status: 'ACTIVE', isDeleted: false } });
    const leads = await prisma.customer.count({ where: { status: 'LEAD', isDeleted: false } });
    const inactive = await prisma.customer.count({ where: { status: 'INACTIVE', isDeleted: false } });

    return { total, active, leads, inactive };
  }

  async todayFollowUps() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return prisma.customer.count({
      where: {
        followUpDate: {
          gte: today,
          lt: tomorrow
        },
        isDeleted: false
      }
    });
  }

  async overdueFollowUps() {
    return prisma.customer.count({
      where: {
        followUpDate: {
          lt: new Date()
        },
        status: 'ACTIVE',
        isDeleted: false
      }
    });
  }

  async upcomingFollowUps() {
    return prisma.customer.count({
      where: {
        followUpDate: {
          gt: new Date()
        },
        isDeleted: false
      }
    });
  }

  async recentCustomers() {
    return prisma.customer.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        customerName: true,
        businessName: true,
        status: true,
        createdAt: true
      }
    });
  }

  async recentActivities() {
    return prisma.followUp.findMany({
      include: {
        customer: true,
        createdBy: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }
}

export default new DashboardRepository();
