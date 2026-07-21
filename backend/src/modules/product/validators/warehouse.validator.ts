import { z } from 'zod';

export const createWarehouseSchema = z.object({
  name: z.string().min(3, 'Warehouse name is required'),
  location: z.string().optional()
});

export const updateWarehouseSchema = z.object({
  name: z.string().min(3).optional(),
  location: z.string().optional()
});
