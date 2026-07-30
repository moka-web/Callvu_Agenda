import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { TurnoController } from './turno.controller';
import { TurnoService } from './turno.service';

describe('TurnoController (HTTP & Zod Validation)', () => {
  let app: express.Application;
  let mockService: Partial<TurnoService>;

  beforeEach(() => {
    mockService = {
      createTurno: vi.fn(),
      getTurnoById: vi.fn(),
      getTurnosByAgenda: vi.fn(),
      updateEstadoTurno: vi.fn(),
      cancelarTurno: vi.fn(),
    };

    const controller = new TurnoController(mockService as TurnoService);
    app = express();
    app.use(express.json());
    app.use('/turnos', controller.router);
  });

  it('POST /turnos - debe rechazar payload con agendaId o fechaHora inválidos (400 Bad Request)', async () => {
    const response = await request(app).post('/turnos').send({
      agendaId: 'no-uuid',
      clienteId: '123e4567-e89b-12d3-a456-426614174000',
      fechaHora: 'fecha-invalida',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error de validación');
    expect(response.body.details).toHaveLength(2);
  });

  it('POST /turnos - debe crear un turno con 201 Created cuando el DTO es válido', async () => {
    const validDto = {
      agendaId: '123e4567-e89b-12d3-a456-426614174000',
      clienteId: '123e4567-e89b-12d3-a456-426614174001',
      fechaHora: '2026-08-03T10:00:00.000Z',
    };

    const createdTurno = {
      id: 'uuid-turno-500',
      ...validDto,
      fechaHora: new Date(validDto.fechaHora),
      duracion: 30,
      estado: 'confirmado' as const,
      createdAt: new Date(),
    };

    (mockService.createTurno as any).mockResolvedValue(createdTurno);

    const response = await request(app).post('/turnos').send(validDto);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe('uuid-turno-500');
    expect(mockService.createTurno).toHaveBeenCalledWith(validDto);
  });
});
