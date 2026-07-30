import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';

describe('AgendaController (HTTP Endpoints & Validation)', () => {
  let app: express.Application;
  let mockService: Partial<AgendaService>;

  beforeEach(() => {
    mockService = {
      createAgenda: vi.fn(),
      getAgendaById: vi.fn(),
      getAllAgendas: vi.fn(),
      updateAgenda: vi.fn(),
      deleteAgenda: vi.fn(),
    };

    const controller = new AgendaController(mockService as AgendaService);
    app = express();
    app.use(express.json());
    app.use('/agendas', controller.router);
  });

  it('POST /agendas - debe rechazar un payload inválido con 400 Bad Request (Zod Middleware)', async () => {
    const response = await request(app).post('/agendas').send({
      nombre: 'Ab', // Menos de 3 caracteres
      duracionSlot: -10, // Inválido
      horariosAtencion: [], // Vacío
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error de validación');
    expect(response.body.details).toHaveLength(3);
  });

  it('POST /agendas - debe crear una agenda con 201 Created cuando el DTO es válido', async () => {
    const validPayload = {
      nombre: 'Agenda Odontológica',
      duracionSlot: 30,
      activa: true,
      horariosAtencion: [
        { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' },
      ],
    };

    const createdAgenda = { id: 'uuid-999', ...validPayload, createdAt: new Date() };
    (mockService.createAgenda as any).mockResolvedValue(createdAgenda);

    const response = await request(app).post('/agendas').send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe('uuid-999');
    expect(mockService.createAgenda).toHaveBeenCalled();
  });
});
