import { z } from 'zod';

export const createCustomerSchema = z.object({
  customerName: z.string().min(3),
  mobile: z.string().min(10),
  email: z.string().email().optional(),
  businessName: z.string(),
  gstNumber: z.string().optional(),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']).optional(),
  address: z.string(),
  followUpDate: z.string().optional(),
  notes: z.string().optional()
});
