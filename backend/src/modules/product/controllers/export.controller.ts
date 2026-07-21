import { Request, Response } from 'express';
import exportService from '../services/export.service';

class ExportController {
  async exportCSV(req: Request, res: Response) {
    try {
      const csv = await exportService.exportProducts();
      res.header('Content-Type', 'text/csv');
      res.attachment('products.csv');
      return res.send(csv);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new ExportController();

