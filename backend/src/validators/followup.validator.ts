import { z } from 'zod';

export const followUpSchema = z.object({
  note: z.string().min(5),
  followUpDate: z.string().optional()
});
