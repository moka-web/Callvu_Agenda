import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './error-handler.middleware';
import { NotFoundError, BadRequestError } from '../errors/app-error';
import { ZodError } from 'zod';

describe('errorHandler Middleware (TDD)', () => {
  const mockReq = {} as Request;
  let mockRes: Partial<Response>;
  let jsonFn: any;
  let statusFn: any;
  const nextFn = vi.fn() as NextFunction;

  beforeEach(() => {
    jsonFn = vi.fn();
    statusFn = vi.fn().mockReturnValue({ json: jsonFn });
    mockRes = {
      status: statusFn,
    };
  });

  it('debe manejar un AppError (ej. NotFoundError) devolviendo su statusCode y mensaje', () => {
    const error = new NotFoundError('Agenda no encontrada');

    errorHandler(error, mockReq, mockRes as Response, nextFn);

    expect(statusFn).toHaveBeenCalledWith(404);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Agenda no encontrada',
        statusCode: 404,
      })
    );
  });

  it('debe manejar un ZodError devolviendo status 400 y los detalles de validación', () => {
    const zodError = new ZodError([
      {
        code: 'too_small',
        minimum: 3,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Mínimo 3 caracteres',
        path: ['nombre'],
      },
    ]);

    errorHandler(zodError, mockReq, mockRes as Response, nextFn);

    expect(statusFn).toHaveBeenCalledWith(400);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Error de validación',
        details: [{ field: 'nombre', message: 'Mínimo 3 caracteres' }],
      })
    );
  });

  it('debe manejar un error no controlado retornando status 500', () => {
    const unhandledError = new Error('Database unexpected failure');

    errorHandler(unhandledError, mockReq, mockRes as Response, nextFn);

    expect(statusFn).toHaveBeenCalledWith(500);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Error interno del servidor',
        statusCode: 500,
      })
    );
  });
});
