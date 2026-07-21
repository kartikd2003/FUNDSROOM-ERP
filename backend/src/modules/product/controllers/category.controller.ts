import { Request, Response } from 'express';
import CategoryService from '../services/category.service';

class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategory(Number(req.params.id));
      return res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(Number(req.params.id), req.body);
      return res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      await CategoryService.deleteCategory(Number(req.params.id));
      return res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new CategoryController();
