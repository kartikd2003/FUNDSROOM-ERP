import { NextFunction, Request, Response } from 'express';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: result.error.errors.map((error: any) => error.message)
    });
  }

  req.body = result.data;
  return next();
};
