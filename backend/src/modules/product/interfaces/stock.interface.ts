export interface CreateStockMovementDTO {
  productId: number;
  warehouseId: number;
  quantity: number;
  type: 'IN' | 'OUT';
  reason?: string;
  userId?: number;
}

export interface StockUpdateDTO {
  quantity: number;
  warehouseId: number;
  reason?: string;
  userId?: number;
}
