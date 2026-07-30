import { z } from 'zod';

export const horarioAtencionSchema = z.object({
  diaSemana: z.number().int().min(0).max(6), // 0: Domingo, 6: Sábado
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:MM)'),
  horaFin: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:MM)'),
});

export const createAgendaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  duracionSlot: z.number().int().positive('La duración del slot debe ser mayor a 0'),
  activa: z.boolean().default(true),
  horariosAtencion: z.array(horarioAtencionSchema).min(1, 'Debe configurar al menos un horario de atención'),
});

export type HorarioAtencionDto = z.infer<typeof horarioAtencionSchema>;
export type CreateAgendaDto = z.infer<typeof createAgendaSchema>;

export const updateAgendaSchema = createAgendaSchema.partial();
export type UpdateAgendaDto = z.infer<typeof updateAgendaSchema>;
