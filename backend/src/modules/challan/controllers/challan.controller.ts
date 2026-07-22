import { Request, Response } from 'express';
import ChallanService from '../services/challan.service';

class ChallanController {
  async createChallan(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const challan = await ChallanService.createChallan(req.body, userId);
      return res.status(201).json({ success: true, message: 'Challan created', data: challan });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getChallans(req: Request, res: Response) {
    try {
      const result = await ChallanService.getChallans(req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async getChallan(req: Request, res: Response) {
    try {
      const challan = await ChallanService.getChallan(Number(req.params.id));
      return res.status(200).json({ success: true, data: challan });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async confirmChallan(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const challan = await ChallanService.confirmChallan(Number(req.params.id), userId);
      return res.status(200).json({ success: true, message: 'Challan confirmed', data: challan });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async cancelChallan(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const challan = await ChallanService.cancelChallan(Number(req.params.id), userId);
      return res.status(200).json({ success: true, message: 'Challan cancelled', data: challan });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new ChallanController();