import dashboardRepository from '../repositories/dashboard.repository';

class DashboardService {
  async getSummary() {
    const [
      totalProducts,
      totalCategories,
      totalWarehouses,
      inventoryValue,
      lowStock,
      outOfStock
    ] = await Promise.all([
      dashboardRepository.getTotalProducts(),
      dashboardRepository.getTotalCategories(),
      dashboardRepository.getTotalWarehouses(),
      dashboardRepository.getInventoryValue(),
      dashboardRepository.getLowStockCount(),
      dashboardRepository.getOutOfStockCount()
    ]);

    return {
      totalProducts,
      totalCategories,
      totalWarehouses,
      inventoryValue,
      lowStock,
      outOfStock
    };
  }

  async getCategoryStock() {
    return dashboardRepository.getCategoryStock();
  }

  async getStockMovement() {
    return dashboardRepository.getMonthlyStockMovement();
  }

  async getRecentActivity() {
    return dashboardRepository.getRecentActivity();
  }

  async getLowStockProducts() {
    return dashboardRepository.getLowStockProducts();
  }
}

export default new DashboardService();

