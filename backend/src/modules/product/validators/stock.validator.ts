import { z } from 'zod';

export const stockMovementSchema = z.object({
  productId: z.number().positive(),
  warehouseId: z.number().positive(),
  quantity: z.number().positive('Quantity must be greater than zero'),
  type: z.enum(['IN', 'OUT']),
  reason: z.string().optional()
});
