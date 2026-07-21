import bcrypt from 'bcrypt';
import { PrismaClient, Role, CustomerType, CustomerStatus, StockMovementType, AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ──────────────────────────────────────────────
  // 1. USERS
  // ──────────────────────────────────────────────
  const password = await bcrypt.hash('Password@123', 10);

  const userData = [
    { fullName: 'System Admin', email: 'admin@erp.com', password, role: Role.ADMIN },
    { fullName: 'Sales User', email: 'sales@erp.com', password, role: Role.SALES },
    { fullName: 'Warehouse User', email: 'warehouse@erp.com', password, role: Role.WAREHOUSE },
    { fullName: 'Accounts User', email: 'accounts@erp.com', password, role: Role.ACCOUNTS },
  ];

  const createdUsers: Record<string, any> = {};

  for (const u of userData) {
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.user.create({ data: u });
      console.log(`  ✅ Created user: ${u.fullName} (${u.email})`);
    } else {
      console.log(`  ⏭️  User already exists: ${u.email}`);
    }
    createdUsers[u.role] = user;
  }

  const adminId = createdUsers[Role.ADMIN].id;
  const salesUserId = createdUsers[Role.SALES].id;
  const warehouseUserId = createdUsers[Role.WAREHOUSE].id;

  // ──────────────────────────────────────────────
  // 2. CUSTOMERS (Fake customers)
  // ──────────────────────────────────────────────
  const customerData = [
    { customerName: 'Rajesh Patel', mobile: '9876543210', email: 'rajesh.patel@example.com', businessName: 'Patel Electronics', gstNumber: '27AABCU1234D1Z5', customerType: 'WHOLESALE' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '42, Lamington Road, Mumbai - 400004', notes: 'Bulk buyer of electronic components, monthly orders' },
    { customerName: 'Priya Sharma', mobile: '9876543211', email: 'priya.sharma@example.com', businessName: 'Sharma Office Solutions', gstNumber: '07DEFG5678H1Z2', customerType: 'RETAIL' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '15, Nehru Place, New Delhi - 110019', notes: 'Regular customer for office supplies and furniture' },
    { customerName: 'Amit Singh', mobile: '9876543212', email: 'amit.singh@example.com', businessName: 'Singh Distributors', gstNumber: '29IJKL9012M3N4', customerType: 'DISTRIBUTOR' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '88, Industrial Area, Ahmedabad - 380002', notes: 'Key distributor for Western region, 15+ years association' },
    { customerName: 'Sunita Deshmukh', mobile: '9876543213', email: 'sunita.d@example.com', businessName: 'Deshmukh Trading Co.', gstNumber: '27MNOP3456Q7R8', customerType: 'WHOLESALE' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '203, Market Yard, Pune - 411037', notes: 'Wholesale buyer of packaging materials and safety equipment' },
    { customerName: 'Vikram Joshi', mobile: '9876543214', email: 'vikram.joshi@example.com', businessName: 'Joshi Furnishings', gstNumber: '08STUV7890W1X2', customerType: 'RETAIL' as CustomerType, status: 'LEAD' as CustomerStatus, address: '5, MG Road, Jaipur - 302001', notes: 'New lead - interested in bulk furniture purchase for hotel project' },
    { customerName: 'Ananya Gupta', mobile: '9876543215', email: 'ananya.g@example.com', businessName: 'Gupta Stationers', gstNumber: null, customerType: 'RETAIL' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '12, College Street, Kolkata - 700073', notes: 'Small business, regular orders for office supplies' },
    { customerName: 'Mohammed Khan', mobile: '9876543216', email: 'mkhan@example.com', businessName: 'Khan Industrial Supplies', gstNumber: '23YZAB1234C5D6', customerType: 'DISTRIBUTOR' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '56, Industrial Zone, Bhiwandi - 421302', notes: 'Major distributor for raw materials in Maharashtra' },
    { customerName: 'Deepa Nair', mobile: '9876543217', email: 'deepa.nair@example.com', businessName: 'Nair Enterprises', gstNumber: '32EFGH7890I1J2', customerType: 'WHOLESALE' as CustomerType, status: 'INACTIVE' as CustomerStatus, address: '7, SIPCOT Industrial Complex, Chennai - 600032', notes: 'Inactive since 2024 - payment issues, follow up needed' },
    { customerName: 'Rohit Mehta', mobile: '9876543218', email: 'rohit.mehta@example.com', businessName: 'Mehta Packaging', gstNumber: '09KLMN3456O7P8', customerType: 'WHOLESALE' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '34, Industrial Estate, Ludhiana - 141003', notes: 'Regular buyer of packaging materials, monthly order value ~50K' },
    { customerName: 'Kavita Reddy', mobile: '9876543219', email: 'kavita.r@example.com', businessName: 'Reddy Safety Solutions', gstNumber: '29QRST7890U1V2', customerType: 'RETAIL' as CustomerType, status: 'LEAD' as CustomerStatus, address: '22, BTM Layout, Bengaluru - 560076', notes: 'Prospective buyer for safety equipment - factory setup' },
    { customerName: 'Suresh Verma', mobile: '9876543220', email: 'suresh.v@example.com', businessName: 'Verma Traders', gstNumber: null, customerType: 'RETAIL' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '9, Sadar Bazar, Nagpur - 440001', notes: 'Small trader, cash-on-delivery basis' },
    { customerName: 'Neha Agarwal', mobile: '9876543221', email: 'neha.a@example.com', businessName: 'Agarwal Office Interiors', gstNumber: '23WXYZ1234E5F6', customerType: 'WHOLESALE' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '45, Civil Lines, Kanpur - 208001', notes: 'Bulk orders for office furniture and supplies, quarterly purchase' },
    { customerName: 'Arjun Tiwari', mobile: '9876543222', email: 'arjun.t@example.com', businessName: 'Tiwari Raw Materials', gstNumber: '19GHIJ5678K9L0', customerType: 'DISTRIBUTOR' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '67, MIDC Area, Thane - 400604', notes: 'Key distributor for raw materials, supplies to 20+ manufacturers' },
    { customerName: 'Pooja Malhotra', mobile: '9876543223', email: 'pooja.m@example.com', businessName: 'Malhotra Electronics', gstNumber: '07MNOP9012Q3R4', customerType: 'RETAIL' as CustomerType, status: 'INACTIVE' as CustomerStatus, address: '18, Chandni Chowk, Delhi - 110006', notes: 'Inactive - shifted to online-only business model' },
    { customerName: 'Ganesh Iyer', mobile: '9876543224', email: 'ganesh.i@example.com', businessName: 'Iyer Industrial Corp', gstNumber: '33STUV3456W7X8', customerType: 'WHOLESALE' as CustomerType, status: 'ACTIVE' as CustomerStatus, address: '91, Ambattur Industrial Estate, Chennai - 600058', notes: 'Premium client, high-value orders for industrial supplies' },
  ];

  for (const c of customerData) {
    const existing = await prisma.customer.findUnique({ where: { mobile: c.mobile } });
    if (!existing) {
      await prisma.customer.create({
        data: {
          customerName: c.customerName,
          mobile: c.mobile,
          email: c.email,
          businessName: c.businessName,
          gstNumber: c.gstNumber,
          customerType: c.customerType,
          status: c.status,
          address: c.address,
          notes: c.notes,
          createdById: salesUserId,
        },
      });
      console.log(`  ✅ Created customer: ${c.customerName} (${c.businessName})`);
    } else {
      console.log(`  ⏭️  Customer already exists: ${c.mobile}`);
    }
  }

  // ──────────────────────────────────────────────
  // 3. CATEGORIES
  // ──────────────────────────────────────────────
  const categoryData = [
    { name: 'Electronics', description: 'Electronic devices and components including circuits, sensors, and power supplies' },
    { name: 'Furniture', description: 'Office and industrial furniture including desks, chairs, and storage units' },
    { name: 'Office Supplies', description: 'Stationery, printer consumables, and general office consumables' },
    { name: 'Packaging Materials', description: 'Corrugated boxes, bubble wrap, tapes, and packing accessories' },
    { name: 'Raw Materials', description: 'Base raw materials used in manufacturing and production processes' },
    { name: 'Safety Equipment', description: 'PPE, helmets, gloves, safety goggles, and fire safety gear' },
  ];

  const categoryMap: Record<string, number> = {};

  for (const cat of categoryData) {
    let category = await prisma.category.findUnique({ where: { name: cat.name } });
    if (!category) {
      category = await prisma.category.create({ data: cat });
      console.log(`  ✅ Created category: ${cat.name}`);
    } else {
      console.log(`  ⏭️  Category already exists: ${cat.name}`);
    }
    categoryMap[cat.name] = category.id;
  }

  // ──────────────────────────────────────────────
  // 3. WAREHOUSES
  // ──────────────────────────────────────────────
  const warehouseData = [
    { name: 'Main Warehouse - Bhiwandi', location: 'Bhiwandi Industrial Area, Maharashtra' },
    { name: 'Secondary Warehouse - Pune', location: 'Pimpri Chinchwad, Pune, Maharashtra' },
    { name: 'Distribution Center - Delhi', location: 'Okhla Industrial Estate, New Delhi' },
  ];

  const warehouseMap: Record<string, number> = {};

  for (const wh of warehouseData) {
    let warehouse = await prisma.warehouse.findUnique({ where: { name: wh.name } });
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({ data: wh });
      console.log(`  ✅ Created warehouse: ${wh.name}`);
    } else {
      console.log(`  ⏭️  Warehouse already exists: ${wh.name}`);
    }
    warehouseMap[wh.name] = warehouse.id;
  }

  // ──────────────────────────────────────────────
  // 4. PRODUCTS (20 realistic products)
  // ──────────────────────────────────────────────
  const productData = [
    // Electronics
    { productName: 'Industrial Grade Resistor Kit (100pcs)', sku: 'ELC-001', unitPrice: 450.00, currentStock: 250, minimumStock: 50, categoryName: 'Electronics', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Arduino Mega 2560 Rev3', sku: 'ELC-002', unitPrice: 2250.00, currentStock: 45, minimumStock: 20, categoryName: 'Electronics', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Raspberry Pi 4 Model B (4GB)', sku: 'ELC-003', unitPrice: 5200.00, currentStock: 12, minimumStock: 15, categoryName: 'Electronics', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: '12V DC Power Supply Adapter', sku: 'ELC-004', unitPrice: 350.00, currentStock: 180, minimumStock: 40, categoryName: 'Electronics', warehouseName: 'Distribution Center - Delhi' },
    { productName: 'Breadboard 830 Point', sku: 'ELC-005', unitPrice: 180.00, currentStock: 0, minimumStock: 30, categoryName: 'Electronics', warehouseName: 'Secondary Warehouse - Pune' },
    // Furniture
    { productName: 'Executive Office Chair (Ergonomic)', sku: 'FUR-001', unitPrice: 8500.00, currentStock: 8, minimumStock: 10, categoryName: 'Furniture', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'L-Shaped Desk 150cm', sku: 'FUR-002', unitPrice: 12500.00, currentStock: 5, minimumStock: 5, categoryName: 'Furniture', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Metal Storage Cabinet (4-Drawer)', sku: 'FUR-003', unitPrice: 7200.00, currentStock: 15, minimumStock: 8, categoryName: 'Furniture', warehouseName: 'Distribution Center - Delhi' },
    // Office Supplies
    { productName: 'Premium A4 Printer Paper (Box of 5 Reams)', sku: 'OFF-001', unitPrice: 1650.00, currentStock: 120, minimumStock: 30, categoryName: 'Office Supplies', warehouseName: 'Secondary Warehouse - Pune' },
    { productName: 'HP LaserJet Toner Cartridge (CF283A)', sku: 'OFF-002', unitPrice: 3200.00, currentStock: 40, minimumStock: 15, categoryName: 'Office Supplies', warehouseName: 'Secondary Warehouse - Pune' },
    { productName: 'Whiteboard Marker Set (12 Colors)', sku: 'OFF-003', unitPrice: 280.00, currentStock: 75, minimumStock: 25, categoryName: 'Office Supplies', warehouseName: 'Main Warehouse - Bhiwandi' },
    // Packaging Materials
    { productName: 'Corrugated Box 12x12x12 Inch (Pack of 25)', sku: 'PKG-001', unitPrice: 580.00, currentStock: 350, minimumStock: 100, categoryName: 'Packaging Materials', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Bubble Wrap Roll (100m x 0.5m)', sku: 'PKG-002', unitPrice: 1200.00, currentStock: 60, minimumStock: 20, categoryName: 'Packaging Materials', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Packing Tape (48mm x 100m) - 6 Rolls', sku: 'PKG-003', unitPrice: 420.00, currentStock: 200, minimumStock: 50, categoryName: 'Packaging Materials', warehouseName: 'Distribution Center - Delhi' },
    // Raw Materials
    { productName: 'Mild Steel Sheet (4ft x 8ft, 2mm thick)', sku: 'RAW-001', unitPrice: 3500.00, currentStock: 25, minimumStock: 10, categoryName: 'Raw Materials', warehouseName: 'Main Warehouse - Bhiwandi' },
    { productName: 'Aluminum Extrusion Profile (1m length)', sku: 'RAW-002', unitPrice: 890.00, currentStock: 0, minimumStock: 20, categoryName: 'Raw Materials', warehouseName: 'Secondary Warehouse - Pune' },
    { productName: 'PVC Granules (25kg Bag)', sku: 'RAW-003', unitPrice: 2800.00, currentStock: 18, minimumStock: 10, categoryName: 'Raw Materials', warehouseName: 'Secondary Warehouse - Pune' },
    // Safety Equipment
    { productName: 'Industrial Safety Helmet (ISI Certified)', sku: 'SAF-001', unitPrice: 450.00, currentStock: 90, minimumStock: 30, categoryName: 'Safety Equipment', warehouseName: 'Distribution Center - Delhi' },
    { productName: 'Nitrile Gloves Box (100 Pairs)', sku: 'SAF-002', unitPrice: 720.00, currentStock: 35, minimumStock: 15, categoryName: 'Safety Equipment', warehouseName: 'Distribution Center - Delhi' },
    { productName: 'Safety Goggles (Anti-Fog, Pack of 10)', sku: 'SAF-003', unitPrice: 980.00, currentStock: 3, minimumStock: 10, categoryName: 'Safety Equipment', warehouseName: 'Main Warehouse - Bhiwandi' },
  ];

  const productIds: number[] = [];
  const productNameMap: Record<string, number> = {};

  for (const p of productData) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          productName: p.productName,
          sku: p.sku,
          unitPrice: p.unitPrice,
          currentStock: p.currentStock,
          minimumStock: p.minimumStock,
          categoryId: categoryMap[p.categoryName],
          warehouseId: warehouseMap[p.warehouseName],
        },
      });
      productIds.push(product.id);
      productNameMap[p.productName] = product.id;
      console.log(`  ✅ Created product: ${p.productName} (SKU: ${p.sku})`);
    } else {
      productIds.push(existing.id);
      productNameMap[existing.productName] = existing.id;
      console.log(`  ⏭️  Product already exists: ${p.sku}`);
    }
  }

  // ──────────────────────────────────────────────
  // 5. STOCK MOVEMENTS
  // ──────────────────────────────────────────────
  const movementData = [
    // Electronics - IN movements
    { productSku: 'ELC-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 500, type: 'IN' as StockMovementType, reason: 'Initial stock purchase from vendor' },
    { productSku: 'ELC-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 50, type: 'OUT' as StockMovementType, reason: 'Issued to production dept - R&D lab setup' },
    { productSku: 'ELC-002', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 60, type: 'IN' as StockMovementType, reason: 'Procurement - Bulk order from manufacturer' },
    { productSku: 'ELC-003', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 20, type: 'IN' as StockMovementType, reason: 'New inventory from distributor' },
    { productSku: 'ELC-004', warehouseName: 'Distribution Center - Delhi', quantity: 200, type: 'IN' as StockMovementType, reason: 'Stock transfer from vendor' },
    { productSku: 'ELC-005', warehouseName: 'Secondary Warehouse - Pune', quantity: 80, type: 'IN' as StockMovementType, reason: 'Initial purchase order #PO-2024-001' },
    { productSku: 'ELC-005', warehouseName: 'Secondary Warehouse - Pune', quantity: 80, type: 'OUT' as StockMovementType, reason: 'Returned to supplier - quality issue' },
    // Furniture - IN movements
    { productSku: 'FUR-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 20, type: 'IN' as StockMovementType, reason: 'New furniture procurement for Q1' },
    { productSku: 'FUR-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 12, type: 'OUT' as StockMovementType, reason: 'Issued to new employee onboarding' },
    { productSku: 'FUR-002', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 10, type: 'IN' as StockMovementType, reason: 'Custom order from Godrej Interio' },
    { productSku: 'FUR-003', warehouseName: 'Distribution Center - Delhi', quantity: 20, type: 'IN' as StockMovementType, reason: 'Stock for Delhi office expansion' },
    // Office Supplies
    { productSku: 'OFF-001', warehouseName: 'Secondary Warehouse - Pune', quantity: 200, type: 'IN' as StockMovementType, reason: 'Bulk purchase - annual supply' },
    { productSku: 'OFF-001', warehouseName: 'Secondary Warehouse - Pune', quantity: 80, type: 'OUT' as StockMovementType, reason: 'Monthly distribution to departments' },
    { productSku: 'OFF-002', warehouseName: 'Secondary Warehouse - Pune', quantity: 60, type: 'IN' as StockMovementType, reason: 'Printer toner stock refill' },
    // Packaging
    { productSku: 'PKG-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 500, type: 'IN' as StockMovementType, reason: 'Bulk packaging order for shipping dept' },
    { productSku: 'PKG-002', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 100, type: 'IN' as StockMovementType, reason: 'Packaging material restock' },
    // Raw Materials
    { productSku: 'RAW-001', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 40, type: 'IN' as StockMovementType, reason: 'Raw material purchase from Tata Steel' },
    { productSku: 'RAW-002', warehouseName: 'Secondary Warehouse - Pune', quantity: 50, type: 'IN' as StockMovementType, reason: 'Aluminum stock for fabrication unit' },
    { productSku: 'RAW-002', warehouseName: 'Secondary Warehouse - Pune', quantity: 50, type: 'OUT' as StockMovementType, reason: 'Consumed in production batch #PB-2024-03' },
    // Safety Equipment
    { productSku: 'SAF-001', warehouseName: 'Distribution Center - Delhi', quantity: 100, type: 'IN' as StockMovementType, reason: 'Safety gear for warehouse staff' },
    { productSku: 'SAF-002', warehouseName: 'Distribution Center - Delhi', quantity: 50, type: 'IN' as StockMovementType, reason: 'PPE kit restock' },
    { productSku: 'SAF-003', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 20, type: 'IN' as StockMovementType, reason: 'New safety goggles stock' },
    { productSku: 'SAF-003', warehouseName: 'Main Warehouse - Bhiwandi', quantity: 17, type: 'OUT' as StockMovementType, reason: 'Distributed to floor supervisors' },
  ];

  // Delete existing movements first (since they reference products)
  const existingMovements = await prisma.stockMovement.findFirst();
  if (!existingMovements) {
    for (const m of movementData) {
      const product = await prisma.product.findUnique({ where: { sku: m.productSku } });
      if (product) {
        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            warehouseId: warehouseMap[m.warehouseName],
            quantity: m.quantity,
            type: m.type,
            reason: m.reason,
            userId: warehouseUserId,
          },
        });
      }
    }
    console.log(`  ✅ Created ${movementData.length} stock movements`);
  } else {
    console.log(`  ⏭️  Stock movements already exist`);
  }

  // ──────────────────────────────────────────────
  // 6. INVENTORY ALERTS
  // ──────────────────────────────────────────────
  // Raw query to find low stock products (currentStock <= minimumStock and not deleted)
  const lowStockIds = await prisma.$queryRaw<Array<{ id: number; productName: string; currentStock: number; minimumStock: number }>>`
    SELECT id, productName, currentStock, minimumStock FROM Product 
    WHERE currentStock <= minimumStock AND deletedAt IS NULL
  `;

  if (lowStockIds.length > 0) {
    const existingAlerts = await prisma.inventoryAlert.findFirst();
    if (!existingAlerts) {
      for (const item of lowStockIds) {
        await prisma.inventoryAlert.create({
          data: {
            productId: item.id,
            message: `Low stock alert: "${item.productName}" has only ${item.currentStock} units remaining (minimum: ${item.minimumStock}). Please reorder soon.`,
            isRead: false,
          },
        });
        console.log(`  ⚠️  Alert created for: ${item.productName} (${item.currentStock}/${item.minimumStock})`);
      }
    } else {
      console.log(`  ⏭️  Inventory alerts already exist`);
    }
  } else {
    console.log(`  ℹ️  No low-stock products found for alerts`);
  }

  // ──────────────────────────────────────────────
  // 7. AUDIT LOGS
  // ──────────────────────────────────────────────
  const existingAudit = await prisma.auditLog.findFirst();
  if (!existingAudit) {
    const auditEntries = [
      { productSku: 'ELC-001', action: 'CREATE' as AuditAction, desc: 'Product created with initial stock of 500 units' },
      { productSku: 'ELC-002', action: 'CREATE' as AuditAction, desc: 'Product created - Arduino Mega 2560' },
      { productSku: 'ELC-003', action: 'CREATE' as AuditAction, desc: 'Product created - Raspberry Pi 4' },
      { productSku: 'FUR-001', action: 'CREATE' as AuditAction, desc: 'Product created - Ergonomic chairs' },
      { productSku: 'ELC-003', action: 'STOCK_UPDATE' as AuditAction, desc: 'Stock updated: IN +20 units (New inventory from distributor)' },
      { productSku: 'FUR-001', action: 'STOCK_UPDATE' as AuditAction, desc: 'Stock updated: OUT -12 units (Issued to new employees)' },
      { productSku: 'OFF-001', action: 'STOCK_UPDATE' as AuditAction, desc: 'Stock updated: OUT -80 units (Monthly departmental distribution)' },
      { productSku: 'SAF-003', action: 'STOCK_UPDATE' as AuditAction, desc: 'Stock updated: OUT -17 units (Distributed to floor supervisors)' },
      { productSku: 'RAW-002', action: 'STOCK_UPDATE' as AuditAction, desc: 'Stock updated: OUT -50 units (Consumed in production batch #PB-2024-03)' },
    ];

    for (const entry of auditEntries) {
      const product = await prisma.product.findUnique({ where: { sku: entry.productSku } });
      if (product) {
        await prisma.auditLog.create({
          data: {
            productId: product.id,
            action: entry.action,
            newValue: { description: entry.desc },
            userId: adminId,
          },
        });
      }
    }
    console.log(`  ✅ Created ${auditEntries.length} audit log entries`);
  } else {
    console.log(`  ⏭️  Audit logs already exist`);
  }

  // ──────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────
  const totalUsers = await prisma.user.count();
  const totalCustomers = await prisma.customer.count();
  const totalCategories = await prisma.category.count();
  const totalWarehouses = await prisma.warehouse.count();
  const totalProducts = await prisma.product.count();
  const totalMovements = await prisma.stockMovement.count();
  const totalAlerts = await prisma.inventoryAlert.count();
  const totalAudits = await prisma.auditLog.count();

  console.log('\n📊 Seeding Summary:');
  console.log(`  👤 Users: ${totalUsers}`);
  console.log(`  👥 Customers: ${totalCustomers}`);
  console.log(`  📂 Categories: ${totalCategories}`);
  console.log(`  🏭 Warehouses: ${totalWarehouses}`);
  console.log(`  📦 Products: ${totalProducts}`);
  console.log(`  🔄 Stock Movements: ${totalMovements}`);
  console.log(`  🔔 Inventory Alerts: ${totalAlerts}`);
  console.log(`  📋 Audit Logs: ${totalAudits}`);
  console.log('\n✅ Database Seeded Successfully!');
}

main()
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

