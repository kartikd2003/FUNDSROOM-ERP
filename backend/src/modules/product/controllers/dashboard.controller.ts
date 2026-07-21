import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

class DashboardController {
  async getSummary(req: Request, res: Response) {
    try {
      const data = await dashboardService.getSummary();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCategoryStock(req: Request, res: Response) {
    try {
      const data = await dashboardService.getCategoryStock();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStockMovement(req: Request, res: Response) {
    try {
      const data = await dashboardService.getStockMovement();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRecentActivity(req: Request, res: Response) {
    try {
      const data = await dashboardService.getRecentActivity();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getLowStockProducts(req: Request, res: Response) {
    try {
      const data = await dashboardService.getLowStockProducts();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new DashboardController();

