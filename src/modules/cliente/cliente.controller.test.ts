import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

describe('ClienteController (HTTP & Zod Validation)', () => {
  let app: express.Application;
  let mockService: Partial<ClienteService>;

  beforeEach(() => {
    mockService = {
      createCliente: vi.fn(),
      getClienteById: vi.fn(),
      getAllClientes: vi.fn(),
      updateCliente: vi.fn(),
      deleteCliente: vi.fn(),
    };

    const controller = new ClienteController(mockService as ClienteService);
    app = express();
    app.use(express.json());
    app.use('/clientes', controller.router);
  });

  it('POST /clientes - debe rechazar un payload con teléfono o nombre inválido (400 Bad Request)', async () => {
    const response = await request(app).post('/clientes').send({
      nombre: 'Al', // corto (< 3)
      telefono: '123', // corto (< 8)
      email: 'no-es-email', // inválido
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error de validación');
    expect(response.body.details).toHaveLength(3);
  });

  it('POST /clientes - debe crear un cliente con 201 Created cuando los datos son válidos', async () => {
    const validDto = {
      nombre: 'Laura Fernández',
      telefono: '+5491144332211',
      email: 'laura@example.com',
    };

    const createdCliente = { id: 'uuid-cli-100', ...validDto, createdAt: new Date() };
    (mockService.createCliente as any).mockResolvedValue(createdCliente);

    const response = await request(app).post('/clientes').send(validDto);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe('uuid-cli-100');
    expect(mockService.createCliente).toHaveBeenCalledWith(validDto);
  });
});
