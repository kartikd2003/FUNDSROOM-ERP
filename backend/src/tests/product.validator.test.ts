import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductSchema } from '../modules/product/validators/product.validator';

test('createProductSchema rejects negative stock', () => {
  const result = createProductSchema.safeParse({
    productName: 'Laptop',
    sku: 'LAP001',
    categoryId: 1,
    warehouseId: 1,
    unitPrice: 50000,
    currentStock: -1,
    minimumStock: 0
  });

  assert.equal(result.success, false);
});

test('createProductSchema accepts valid product payload', () => {
  const result = createProductSchema.safeParse({
    productName: 'Laptop',
    sku: 'LAP001',
    categoryId: 1,
    warehouseId: 1,
    unitPrice: 50000,
    currentStock: 10,
    minimumStock: 2
  });

  assert.equal(result.success, true);
});
