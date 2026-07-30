import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
      timestamp,
    });
    return;
  }

  if (err instanceof ZodError) {
    const issues = err.issues || [];
    res.status(400).json({
      error: 'Error de validación',
      statusCode: 400,
      details: issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      timestamp,
    });
    return;
  }

  console.error(`[Unhandled Error] ${err.stack || err.message}`);

  res.status(500).json({
    error: 'Error interno del servidor',
    statusCode: 500,
    timestamp,
  });
};
