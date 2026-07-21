import { Request, Response } from 'express';
import WarehouseService from '../services/warehouse.service';

class WarehouseController {
  async createWarehouse(req: Request, res: Response) {
    try {
      const warehouse = await WarehouseService.createWarehouse(req.body);
      return res.status(201).json({ success: true, data: warehouse });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getWarehouses(req: Request, res: Response) {
    try {
      const warehouses = await WarehouseService.getWarehouses();
      return res.status(200).json({ success: true, data: warehouses });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async getWarehouse(req: Request, res: Response) {
    try {
      const warehouse = await WarehouseService.getWarehouse(Number(req.params.id));
      return res.status(200).json({ success: true, data: warehouse });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async updateWarehouse(req: Request, res: Response) {
    try {
      const warehouse = await WarehouseService.updateWarehouse(Number(req.params.id), req.body);
      return res.status(200).json({ success: true, data: warehouse });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async deleteWarehouse(req: Request, res: Response) {
    try {
      await WarehouseService.deleteWarehouse(Number(req.params.id));
      return res.status(200).json({ success: true, message: 'Warehouse deleted' });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new WarehouseController();
