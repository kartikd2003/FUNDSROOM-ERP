import imageRepository from '../repositories/image.repository';

class ImageService {
  async saveProductImage(productId: number, file: any) {
    if (!file) {
      throw new Error('Image required');
    }

    const imagePath = `/uploads/products/${file.filename}`;
    return imageRepository.updateProductImage(productId, imagePath);
  }
}

export default new ImageService();

