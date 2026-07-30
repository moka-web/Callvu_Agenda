import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';

describe('SlotController (HTTP GET /slots & Query Validation)', () => {
  let app: express.Application;
  let mockService: Partial<SlotService>;

  beforeEach(() => {
    mockService = {
      calcularSlots: vi.fn(),
    };

    const controller = new SlotController(mockService as SlotService);
    app = express();
    app.use(express.json());
    app.use('/slots', controller.router);
  });

  it('GET /slots - debe rechazar parámetros de consulta faltantes o inválidos (400 Bad Request)', async () => {
    const response = await request(app).get('/slots?agendaId=no-uuid&fecha=03-08-2026');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error de validación en parámetros de consulta');
    expect(response.body.details).toHaveLength(2);
  });

  it('GET /slots - debe retornar la lista de slots cuando los parámetros son válidos', async () => {
    const agendaId = '123e4567-e89b-12d3-a456-426614174000';
    const fecha = '2026-08-03';

    const mockSlots = [
      { fechaHora: '2026-08-03T09:00:00.000Z', disponible: true, agendaId },
      { fechaHora: '2026-08-03T09:30:00.000Z', disponible: false, agendaId },
    ];

    (mockService.calcularSlots as any).mockResolvedValue(mockSlots);

    const response = await request(app).get(`/slots?agendaId=${agendaId}&fecha=${fecha}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSlots);
    expect(mockService.calcularSlots).toHaveBeenCalledWith(agendaId, fecha);
  });
});
