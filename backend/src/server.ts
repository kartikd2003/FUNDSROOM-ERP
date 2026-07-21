import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';
import bcrypt from 'bcrypt';

dotenv.config();

const PORT = process.env.PORT || 5000;

const BOOTSTRAP_USERS = [
  { fullName: 'System Admin', email: 'admin@erp.com', role: 'ADMIN' as const, password: 'Admin@123' },
  { fullName: 'Sales User', email: 'sales@erp.com', role: 'SALES' as const, password: 'Password@123' },
  { fullName: 'Warehouse User', email: 'warehouse@erp.com', role: 'WAREHOUSE' as const, password: 'Password@123' },
  { fullName: 'Accounts User', email: 'accounts@erp.com', role: 'ACCOUNTS' as const, password: 'Password@123' },
];

const bootstrapUsers = async () => {
  for (const u of BOOTSTRAP_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });

    if (!existing) {
      const password = await bcrypt.hash(u.password, 10);

      await prisma.user.create({
        data: {
          fullName: u.fullName,
          email: u.email,
          password,
          role: u.role
        }
      });

      console.log(`Seeded user: ${u.email} (${u.role})`);
    }
  }
};

const start = async () => {
  await bootstrapUsers();

  app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
