import { NextFunction, Request, Response } from 'express';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: issues.map((error: any) => error.message)
    });
  }

  req.body = result.data;
  return next();
};
