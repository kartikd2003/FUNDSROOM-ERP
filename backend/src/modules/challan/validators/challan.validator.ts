import { z } from 'zod';

export const createChallanSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(
    z.object({
      productId: z.number().positive(),
      quantity: z.number().positive('Quantity must be greater than zero')
    })
  ).min(1, 'At least one product is required'),
  status: z.enum(['DRAFT', 'CONFIRMED']).optional()
});