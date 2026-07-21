import dashboardRepository from '../repositories/dashboard.repository';

class DashboardService {
  async getDashboardStats() {
    const [counts, todayFollowUps, overdueFollowUps, upcomingFollowUps, recentCustomers, recentActivities] = await Promise.all([
      dashboardRepository.getCounts(),
      dashboardRepository.todayFollowUps(),
      dashboardRepository.overdueFollowUps(),
      dashboardRepository.upcomingFollowUps(),
      dashboardRepository.recentCustomers(),
      dashboardRepository.recentActivities()
    ]);

    return {
      counts,
      followUps: {
        today: todayFollowUps,
        overdue: overdueFollowUps,
        upcoming: upcomingFollowUps
      },
      recentCustomers,
      recentActivities
    };
  }
}

export default new DashboardService();
