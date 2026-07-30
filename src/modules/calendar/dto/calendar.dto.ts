import { z } from 'zod';

export const createCalendarEventSchema = z.object({
  agendaNombre: z.string().min(1, 'El nombre de la agenda es requerido'),
  clienteNombre: z.string().min(1, 'El nombre del cliente es requerido'),
  fechaHora: z.string().datetime('Formato de fechaHora inválido (ISO-8601 UTC)'),
  duracionMinutos: z.number().int().positive('La duración debe ser positiva'),
  descripcion: z.string().optional(),
});

export type CreateCalendarEventDto = z.infer<typeof createCalendarEventSchema>;

export const oauthCallbackQuerySchema = z.object({
  code: z.string().min(1, 'El código OAuth es requerido'),
});

export type OauthCallbackQueryDto = z.infer<typeof oauthCallbackQuerySchema>;
