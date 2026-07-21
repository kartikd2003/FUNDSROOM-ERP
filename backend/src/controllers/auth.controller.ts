import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      await registerUser(req.body);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const result = await loginUser(req.body);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async profile(req: any, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        data: req.user
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async changePassword(req: any, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await this.changePasswordService(req.user.id, oldPassword, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  private async changePasswordService(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      throw new Error('Old password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash }
    });

    return { message: 'Password changed successfully' };
  }
}

import prisma from '../config/db';
import bcrypt from 'bcrypt';

export default new AuthController();
