import prisma from '../config/db';

const PRODUCTS = [
  { name: 'Dell Inspiron 15 Laptop', sku: 'LAP-001', category: 'Laptops', warehouse: 'Main Warehouse', price: 55999, stock: 18, minStock: 5 },
  { name: 'HP Pavilion Laptop', sku: 'LAP-002', category: 'Laptops', warehouse: 'Main Warehouse', price: 62999, stock: 12, minStock: 5 },
  { name: 'Lenovo ThinkPad E14', sku: 'LAP-003', category: 'Laptops', warehouse: 'Warehouse A', price: 68999, stock: 9, minStock: 4 },
  { name: 'Apple MacBook Air M2', sku: 'LAP-004', category: 'Laptops', warehouse: 'Warehouse B', price: 104999, stock: 6, minStock: 2 },
  { name: 'Samsung Galaxy S24', sku: 'MOB-001', category: 'Mobile Phones', warehouse: 'Main Warehouse', price: 74999, stock: 25, minStock: 8 },
  { name: 'iPhone 15', sku: 'MOB-002', category: 'Mobile Phones', warehouse: 'Warehouse A', price: 79999, stock: 14, minStock: 5 },
  { name: 'OnePlus 12', sku: 'MOB-003', category: 'Mobile Phones', warehouse: 'Warehouse B', price: 64999, stock: 17, minStock: 6 },
  { name: 'Xiaomi Redmi Note 13', sku: 'MOB-004', category: 'Mobile Phones', warehouse: 'Main Warehouse', price: 18999, stock: 35, minStock: 10 },
  { name: 'Boat Rockerz 550', sku: 'AUD-001', category: 'Audio', warehouse: 'Warehouse A', price: 2499, stock: 40, minStock: 15 },
  { name: 'Sony WH-CH720N', sku: 'AUD-002', category: 'Audio', warehouse: 'Warehouse B', price: 8999, stock: 20, minStock: 5 },
  { name: 'JBL Flip 6', sku: 'AUD-003', category: 'Audio', warehouse: 'Main Warehouse', price: 10999, stock: 16, minStock: 5 },
  { name: 'Logitech MX Master 3S', sku: 'ACC-001', category: 'Accessories', warehouse: 'Warehouse A', price: 8999, stock: 22, minStock: 8 },
  { name: 'Logitech K380 Keyboard', sku: 'ACC-002', category: 'Accessories', warehouse: 'Warehouse B', price: 3499, stock: 31, minStock: 10 },
  { name: 'HP Wireless Mouse', sku: 'ACC-003', category: 'Accessories', warehouse: 'Main Warehouse', price: 999, stock: 65, minStock: 20 },
  { name: 'Samsung 27 Monitor', sku: 'MON-001', category: 'Monitors', warehouse: 'Warehouse A', price: 17999, stock: 11, minStock: 4 },
  { name: 'LG UltraWide 29', sku: 'MON-002', category: 'Monitors', warehouse: 'Warehouse B', price: 24999, stock: 8, minStock: 3 },
  { name: 'ASUS Gaming Monitor', sku: 'MON-003', category: 'Monitors', warehouse: 'Main Warehouse', price: 28999, stock: 5, minStock: 2 },
  { name: 'Canon PIXMA G3010', sku: 'PRI-001', category: 'Printers', warehouse: 'Warehouse A', price: 15999, stock: 7, minStock: 2 },
  { name: 'Epson L3250', sku: 'PRI-002', category: 'Printers', warehouse: 'Warehouse B', price: 18499, stock: 6, minStock: 2 },
  { name: 'Brother HL-L2321D', sku: 'PRI-003', category: 'Printers', warehouse: 'Main Warehouse', price: 12999, stock: 10, minStock: 3 },
  { name: 'Seagate 1TB HDD', sku: 'STO-001', category: 'Storage', warehouse: 'Warehouse A', price: 4299, stock: 28, minStock: 10 },
  { name: 'Samsung 1TB SSD', sku: 'STO-002', category: 'Storage', warehouse: 'Warehouse B', price: 6999, stock: 18, minStock: 6 },
  { name: 'SanDisk 128GB Pen Drive', sku: 'STO-003', category: 'Storage', warehouse: 'Main Warehouse', price: 799, stock: 80, minStock: 20 },
  { name: 'TP-Link Archer C6', sku: 'NET-001', category: 'Networking', warehouse: 'Warehouse A', price: 2999, stock: 21, minStock: 7 },
  { name: 'D-Link 8 Port Switch', sku: 'NET-002', category: 'Networking', warehouse: 'Warehouse B', price: 1999, stock: 19, minStock: 6 },
  { name: 'Cisco Router RV340', sku: 'NET-003', category: 'Networking', warehouse: 'Main Warehouse', price: 28999, stock: 4, minStock: 2 },
  { name: 'APC 600VA UPS', sku: 'PWR-001', category: 'Power Backup', warehouse: 'Warehouse A', price: 3999, stock: 15, minStock: 5 },
  { name: 'Zebronics Cabinet', sku: 'CMP-001', category: 'Computer Parts', warehouse: 'Warehouse B', price: 2999, stock: 13, minStock: 5 },
  { name: 'Corsair 16GB DDR4 RAM', sku: 'CMP-002', category: 'Computer Parts', warehouse: 'Main Warehouse', price: 4999, stock: 24, minStock: 8 },
  { name: 'Intel Core i5 13400', sku: 'CMP-003', category: 'Computer Parts', warehouse: 'Warehouse A', price: 21499, stock: 10, minStock: 3 },
];

const seedProductsFromCSV = async () => {
  // Collect unique category/warehouse names and auto-create any that don't exist
  const categoryNames = [...new Set(PRODUCTS.map(p => p.category))];
  const warehouseNames = [...new Set(PRODUCTS.map(p => p.warehouse))];

  for (const name of categoryNames) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (!existing) {
      await prisma.category.create({ data: { name } });
      console.log(`Created category: ${name}`);
    }
  }

  for (const name of warehouseNames) {
    const existing = await prisma.warehouse.findUnique({ where: { name } });
    if (!existing) {
      await prisma.warehouse.create({ data: { name } });
      console.log(`Created warehouse: ${name}`);
    }
  }

  // Now create products
  for (const p of PRODUCTS) {
    const existingSKU = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existingSKU) {
      console.log(`Skipped (SKU exists): ${p.sku}`);
      continue;
    }

    const category = await prisma.category.findUnique({ where: { name: p.category } });
    const warehouse = await prisma.warehouse.findUnique({ where: { name: p.warehouse } });

    await prisma.product.create({
      data: {
        productName: p.name,
        sku: p.sku,
        categoryId: category!.id,
        warehouseId: warehouse!.id,
        unitPrice: p.price,
        currentStock: p.stock,
        minimumStock: p.minStock,
      },
    });
    console.log(`Created product: ${p.name} (${p.sku})`);
  }

  console.log('Seeding complete.');
  process.exit(0);
};

seedProductsFromCSV().catch((err) => {
  console.error(err);
  process.exit(1);
});
