import { PrismaClient, ChallanStatus } from '@prisma/client';

const prisma = new PrismaClient();

// How many fake challans to create
const CHALLAN_COUNT = 25;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDateWithinLastDays(days: number): Date {
  const now = Date.now();
  const past = now - randomInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

async function main() {
  console.log('Fetching existing customers, products, and users...');

  const customers = await prisma.customer.findMany({
    where: { isDeleted: false },
  });
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany();

  if (customers.length === 0) throw new Error('No customers found — seed customers first.');
  if (products.length === 0) throw new Error('No products found — seed products first.');
  if (users.length === 0) throw new Error('No users found — seed users first.');

  // Prefer a SALES or ADMIN user as the creator, fall back to any user
  const creator =
    users.find((u) => u.role === 'SALES') ??
    users.find((u) => u.role === 'ADMIN') ??
    users[0];

  console.log(`Using creator: ${creator.email} (${creator.role})`);
  console.log(`Found ${customers.length} customers, ${products.length} products.`);

  // Find current highest challan number to avoid collisions on repeat runs
  const lastChallan = await prisma.challan.findFirst({
    orderBy: { id: 'desc' },
  });
  let nextNumber = lastChallan
    ? parseInt(lastChallan.challanNumber.replace(/\D/g, ''), 10) + 1 || 1
    : 1;

  const statusPool: ChallanStatus[] = [
    'DRAFT', 'DRAFT',
    'CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'CONFIRMED',
    'CANCELLED',
  ];

  let created = 0;

  for (let i = 0; i < CHALLAN_COUNT; i++) {
    const customer = pickRandom(customers);
    const status = pickRandom(statusPool);
    const createdAt = randomDateWithinLastDays(45);

    // 1–3 line items per challan, avoiding duplicate products in the same challan
    const itemCount = randomInt(1, 3);
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    const chosenProducts = shuffledProducts.slice(0, itemCount);

    const itemsData = chosenProducts.map((p) => {
      const quantity = randomInt(1, 10);
      return {
        productId: p.id,
        productName: p.productName,
        sku: p.sku,
        unitPrice: p.unitPrice,
        quantity,
        warehouseId: p.warehouseId,
      };
    });

    const totalQuantity = itemsData.reduce((sum, it) => sum + it.quantity, 0);

    const challanNumber = `CH-${String(nextNumber).padStart(5, '0')}`;
    nextNumber++;

    const challan = await prisma.challan.create({
      data: {
        challanNumber,
        customerId: customer.id,
        status,
        totalQuantity,
        createdById: creator.id,
        createdAt,
        updatedAt: createdAt,
        confirmedAt: status === 'CONFIRMED' ? createdAt : null,
        cancelledAt: status === 'CANCELLED' ? createdAt : null,
        items: {
          create: itemsData,
        },
      },
    });

    created++;
    console.log(`Created ${challan.challanNumber} for ${customer.customerName} (${status}, qty ${totalQuantity})`);
  }

  console.log(`\nDone. Created ${created} challans.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });