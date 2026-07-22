import bcrypt from 'bcrypt';
import prisma from '../config/db';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';

export type UserRole = 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';

export const registerUser = async (data: { fullName: string; email: string; password: string; role: UserRole }) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: passwordHash,
      role: data.role
    }
  });
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Contact administrator.', 403);
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.fullName,
      role: user.role,
      isActive: user.isActive
    }
  };
};
