import analyticsRepository from '../repositories/analytics.repository';

class AnalyticsService {
  async getAnalytics() {
    const [value, most, least, lowStock, outOfStock, categories] = await Promise.all([
      analyticsRepository.inventoryValue(),
      analyticsRepository.mostStocked(),
      analyticsRepository.leastStocked(),
      analyticsRepository.lowStockProducts(),
      analyticsRepository.outOfStockProducts(),
      analyticsRepository.categoryReport()
    ]);

    return {
      inventoryValue: value,
      mostStocked: most,
      leastStocked: least,
      lowStock,
      outOfStock,
      categories
    };
  }
}

export default new AnalyticsService();

