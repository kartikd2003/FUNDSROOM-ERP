import { Request, Response } from 'express';
import StockService from '../services/stock.service';

class StockController {
  async createMovement(req: Request, res: Response) {
    try {
      const movement = await StockService.createMovement(req.body);
      return res.status(201).json({ success: true, message: 'Stock movement created', data: movement });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async stockHistory(req: Request, res: Response) {
    try {
      const history = await StockService.getHistory(Number(req.params.productId));
      return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async getAllMovements(req: Request, res: Response) {
    try {
      const movements = await StockService.getAllMovements();
      return res.status(200).json({ success: true, data: movements });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async stockIn(req: Request, res: Response) {
    try {
      const product = await StockService.increaseStock(Number(req.params.id), req.body);
      return res.status(200).json({ success: true, message: 'Stock increased successfully', data: product });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async stockOut(req: Request, res: Response) {
    try {
      const product = await StockService.decreaseStock(Number(req.params.id), req.body);
      return res.status(200).json({ success: true, message: 'Stock decreased successfully', data: product });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new StockController();
