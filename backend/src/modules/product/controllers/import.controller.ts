import { Request, Response } from 'express';
import importService from '../services/import.service';

class ImportController {
  async importCSV(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ success: false, message: 'CSV file is required' });
      }
      const result = await importService.importProducts(file.path);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new ImportController();

