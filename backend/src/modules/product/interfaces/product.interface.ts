export interface CreateProductDTO {
  productName: string;
  sku: string;
  categoryId: number;
  warehouseId: number;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
}

export interface UpdateProductDTO {
  productName?: string;
  sku?: string;
  categoryId?: number;
  warehouseId?: number;
  unitPrice?: number;
  currentStock?: number;
  minimumStock?: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  warehouseId?: number;
  stockStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
