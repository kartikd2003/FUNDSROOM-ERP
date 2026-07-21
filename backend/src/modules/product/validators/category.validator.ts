import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(3, 'Category name is required'),
  description: z.string().optional()
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional()
});
