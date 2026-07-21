import { Request, Response } from 'express';
import ProductService from '../services/product.service';

class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      return res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const result = await ProductService.getProducts(req.query as any);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.getProduct(id);
      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.updateProduct(id, req.body);
      return res.status(200).json({ success: true, message: 'Product updated', data: product });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await ProductService.deleteProduct(id);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new ProductController();
