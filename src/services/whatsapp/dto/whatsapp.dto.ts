import { z } from 'zod';

export const webhookVerifyQuerySchema = z.object({
  'hub.mode': z.string().optional(),
  'hub.verify_token': z.string().optional(),
  'hub.challenge': z.string().optional(),
});

export type WebhookVerifyQueryDto = z.infer<typeof webhookVerifyQuerySchema>;

export const sendWhatsAppMessageSchema = z.object({
  to: z.string().min(8, 'El número de teléfono debe ser válido'),
  message: z.string().min(1, 'El mensaje no puede estar vacío'),
});

export type SendWhatsAppMessageDto = z.infer<typeof sendWhatsAppMessageSchema>;
