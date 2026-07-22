export interface ChallanItemInput {
  productId: number;
  quantity: number;
}

export interface CreateChallanDTO {
  customerId: string;
  items: ChallanItemInput[];
  status?: 'DRAFT' | 'CONFIRMED';
}

export interface ChallanQuery {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
}