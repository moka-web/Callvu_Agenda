import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WhatsAppService } from './whatsapp.service';

describe('WhatsAppService (TDD)', () => {
  let service: WhatsAppService;
  let mockHttpClient: any;
  const VERIFY_TOKEN = 'my_secret_token_123';

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
    };
    service = new WhatsAppService(VERIFY_TOKEN, 'phone_id_123', 'api_token_abc', mockHttpClient);
  });

  describe('verifyWebhook', () => {
    it('debe retornar el challenge cuando el mode es subscribe y el verifyToken es correcto', () => {
      const challenge = service.verifyWebhook('subscribe', 'my_secret_token_123', 'challenge_code_999');
      expect(challenge).toBe('challenge_code_999');
    });

    it('debe lanzar un error de verificación cuando el token es inválido', () => {
      expect(() =>
        service.verifyWebhook('subscribe', 'token_incorrecto', 'challenge_code_999')
      ).toThrow('Token de verificación de WhatsApp inválido');
    });
  });

  describe('parseIncomingMessage', () => {
    it('debe extraer el remitente y el texto del mensaje desde el payload de Meta Cloud API', () => {
      const mockMetaPayload = {
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '5491112345678',
                      id: 'wamid.HBgLNTQ5MTExMjM0NTY3OA==',
                      type: 'text',
                      text: { body: 'Quiero reservar un turno' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const parsed = service.parseIncomingMessage(mockMetaPayload);

      expect(parsed).toEqual({
        from: '5491112345678',
        text: 'Quiero reservar un turno',
        messageId: 'wamid.HBgLNTQ5MTExMjM0NTY3OA==',
      });
    });

    it('debe retornar null si el payload no contiene mensajes', () => {
      const emptyPayload = { entry: [] };
      const parsed = service.parseIncomingMessage(emptyPayload);
      expect(parsed).toBeNull();
    });
  });

  describe('sendTextMessage', () => {
    it('debe enviar una petición POST a Meta Graph API con el formato correcto', async () => {
      mockHttpClient.post.mockResolvedValue({ status: 200, data: { messages: [{ id: 'wamid.out' }] } });

      const res = await service.sendTextMessage('+5491112345678', 'Hola, tu turno fue verificado');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://graph.facebook.com/v19.0/phone_id_123/messages',
        {
          messaging_product: 'whatsapp',
          to: '+5491112345678',
          type: 'text',
          text: { body: 'Hola, tu turno fue verificado' },
        },
        {
          headers: {
            Authorization: 'Bearer api_token_abc',
            'Content-Type': 'application/json',
          },
        }
      );

      expect(res.messages[0].id).toBe('wamid.out');
    });
  });
});
