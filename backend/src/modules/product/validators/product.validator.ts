import { z } from 'zod';

export const createProductSchema = z.object({
  productName: z.string().min(3, 'Product name must contain at least 3 characters'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.number().positive('Category is required'),
  warehouseId: z.number().positive('Warehouse is required'),
  unitPrice: z.number().positive('Price must be greater than zero'),
  currentStock: z.number().nonnegative('Stock cannot be negative'),
  minimumStock: z.number().nonnegative('Minimum stock cannot be negative')
});

export const updateProductSchema = z.object({
  productName: z.string().min(3).optional(),
  sku: z.string().min(2).optional(),
  categoryId: z.number().positive().optional(),
  warehouseId: z.number().positive().optional(),
  unitPrice: z.number().positive().optional(),
  currentStock: z.number().nonnegative().optional(),
  minimumStock: z.number().nonnegative().optional()
});
