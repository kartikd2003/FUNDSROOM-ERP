import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';

class DashboardController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
