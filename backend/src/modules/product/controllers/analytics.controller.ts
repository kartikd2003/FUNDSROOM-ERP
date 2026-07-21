import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service';

class AnalyticsController {
  async getAnalytics(req: Request, res: Response) {
    try {
      const data = await analyticsService.getAnalytics();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AnalyticsController();

