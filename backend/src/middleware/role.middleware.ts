import { Request, Response, NextFunction } from 'express';
import { Permission, PERMISSIONS, UserRole } from '../config/permissions';

/**
 * Middleware that checks if the user has one of the specified roles.
 */
export const allowRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role as UserRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    return next();
  };
};

/**
 * Middleware that checks if the user has the required permission.
 * Uses the PERMISSIONS matrix to determine which roles have the permission.
 */
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: no user' });
    }

    const allowedRoles = PERMISSIONS[permission];

    if (!allowedRoles) {
      return res.status(500).json({ message: `Permission ${permission} not defined` });
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return res.status(403).json({
        message: `Forbidden: missing permission ${permission}`
      });
    }

    return next();
  };
};
