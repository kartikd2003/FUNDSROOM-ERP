import prisma from '../../../config/db';

class ImageRepository {
  async updateProductImage(productId: number, imageUrl: string) {
    return prisma.product.update({
      where: { id: productId },
      data: { imageUrl }
    });
  }
}

export default new ImageRepository();

