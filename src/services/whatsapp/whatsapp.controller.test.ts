import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';

describe('WhatsAppController (Meta Webhooks & HTTP)', () => {
  let app: express.Application;
  let mockService: Partial<WhatsAppService>;

  beforeEach(() => {
    mockService = {
      verifyWebhook: vi.fn(),
      parseIncomingMessage: vi.fn(),
      sendTextMessage: vi.fn(),
    };

    const controller = new WhatsAppController(mockService as WhatsAppService);
    app = express();
    app.use(express.json());
    app.use('/webhooks/whatsapp', controller.router);
  });

  it('GET /webhooks/whatsapp - debe retornar el challenge 200 OK si el token es válido', async () => {
    (mockService.verifyWebhook as any).mockReturnValue('challenge_code_123');

    const response = await request(app).get(
      '/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=my_secret&hub.challenge=challenge_code_123'
    );

    expect(response.status).toBe(200);
    expect(response.text).toBe('challenge_code_123');
  });

  it('GET /webhooks/whatsapp - debe retornar 403 Forbidden si el token es inválido', async () => {
    (mockService.verifyWebhook as any).mockImplementation(() => {
      throw new Error('Token de verificación de WhatsApp inválido');
    });

    const response = await request(app).get(
      '/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=bad_token&hub.challenge=challenge_code_123'
    );

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Token de verificación de WhatsApp inválido');
  });

  it('POST /webhooks/whatsapp - debe responder 200 EVENT_RECEIVED al recibir un evento de Meta', async () => {
    (mockService.parseIncomingMessage as any).mockReturnValue({
      from: '5491112345678',
      text: 'Hola',
      messageId: 'wamid.123',
    });

    const response = await request(app).post('/webhooks/whatsapp').send({
      object: 'whatsapp_business_account',
      entry: [],
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('EVENT_RECEIVED');
  });
});
