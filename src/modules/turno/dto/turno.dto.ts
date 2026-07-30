import { z } from 'zod';

export const estadoTurnoEnum = z.enum(['pendiente', 'confirmado', 'completado', 'cancelado', 'no-show']);
export type EstadoTurnoDto = z.infer<typeof estadoTurnoEnum>;

export const createTurnoSchema = z.object({
  agendaId: z.string().uuid('ID de agenda inválido'),
  clienteId: z.string().uuid('ID de cliente inválido'),
  fechaHora: z.string().datetime('Formato de fechaHora inválido (debe ser ISO-8601 UTC)'),
  duracion: z.number().int().positive('La duración debe ser positiva').optional(),
});

export type CreateTurnoDto = z.infer<typeof createTurnoSchema>;

export const updateEstadoTurnoSchema = z.object({
  estado: estadoTurnoEnum,
});

export type UpdateEstadoTurnoDto = z.infer<typeof updateEstadoTurnoSchema>;
