import prisma from '../config/db';

const PRODUCTS = [
  { name: 'Safety Goggles (Anti-Fog, Pack of 10)', sku: 'SAF-003', category: 'Laptops', warehouse: 'Main Warehouse', price: 5, stock: 0, minStock: 0 },
  { name: 'Dell Inspiron 15 Laptop', sku: 'LAP-101', category: 'Laptops', warehouse: 'Main Warehouse', price: 45999, stock: 10, minStock: 2 },
  { name: 'HP Pavilion 14 Laptop', sku: 'LAP-102', category: 'Laptops', warehouse: 'Main Warehouse', price: 52999, stock: 8, minStock: 2 },
  { name: 'Lenovo ThinkPad E14', sku: 'LAP-103', category: 'Laptops', warehouse: 'Main Warehouse', price: 61499, stock: 5, minStock: 2 },
  { name: 'ASUS VivoBook 15', sku: 'LAP-104', category: 'Laptops', warehouse: 'Main Warehouse', price: 41999, stock: 12, minStock: 3 },
  { name: 'Acer Aspire 7', sku: 'LAP-105', category: 'Laptops', warehouse: 'Main Warehouse', price: 55999, stock: 6, minStock: 2 },
  { name: 'MacBook Air M2', sku: 'LAP-106', category: 'Laptops', warehouse: 'Main Warehouse', price: 114900, stock: 4, minStock: 1 },
  { name: 'Laptop Charger 65W', sku: 'LAP-107', category: 'Laptops', warehouse: 'Main Warehouse', price: 899, stock: 30, minStock: 5 },
  { name: 'Laptop Bag 15.6"', sku: 'LAP-108', category: 'Laptops', warehouse: 'Main Warehouse', price: 799, stock: 25, minStock: 5 },
  { name: 'Cooling Pad for Laptop', sku: 'LAP-109', category: 'Laptops', warehouse: 'Main Warehouse', price: 649, stock: 18, minStock: 4 },
];

const seedProducts = async () => {
  for (const p of PRODUCTS) {
    const existingSKU = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existingSKU) {
      console.log(`Skipped (SKU exists): ${p.sku}`);
      continue;
    }

    const category = await prisma.category.findUnique({ where: { name: p.category } });
    if (!category) {
      console.error(`Category not found: "${p.category}" — skipping ${p.sku}`);
      continue;
    }

    const warehouse = await prisma.warehouse.findUnique({ where: { name: p.warehouse } });
    if (!warehouse) {
      console.error(`Warehouse not found: "${p.warehouse}" — skipping ${p.sku}`);
      continue;
    }

    await prisma.product.create({
      data: {
        productName: p.name,
        sku: p.sku,
        categoryId: category.id,
        warehouseId: warehouse.id,
        unitPrice: p.price,
        currentStock: p.stock,
        minimumStock: p.minStock,
      },
    });
    console.log(`Created: ${p.name} (${p.sku})`);
  }

  console.log('Product seeding complete.');
  process.exit(0);
};

seedProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});
