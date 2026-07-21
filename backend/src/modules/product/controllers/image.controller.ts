import { Request, Response } from 'express';
import imageService from '../services/image.service';

class ImageController {
  async uploadImage(req: Request, res: Response) {
    try {
      const product = await imageService.saveProductImage(Number(req.params.id), (req as any).file);
      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: product
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new ImageController();

