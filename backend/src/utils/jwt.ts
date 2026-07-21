import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const jwtSecret = env.JWT_SECRET as string;

export const generateToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret as any, {
    expiresIn: env.JWT_EXPIRES_IN as any
  } as any);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, jwtSecret as any) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
};
