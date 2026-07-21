import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';
import bcrypt from 'bcrypt';

dotenv.config();

const PORT = process.env.PORT || 5000;

const bootstrapAdmin = async () => {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@erp.com' } });

  if (!existingAdmin) {
    const password = await bcrypt.hash('Admin@123', 10);

    await prisma.user.create({
      data: {
        fullName: 'System Admin',
        email: 'admin@erp.com',
        password,
        role: 'ADMIN'
      }
    });

    console.log('Seeded admin user: admin@erp.com');
  }
};

const start = async () => {
  await bootstrapAdmin();

  app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
