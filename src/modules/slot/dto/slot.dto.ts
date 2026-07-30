import { z } from 'zod';

export const getSlotsQuerySchema = z.object({
  agendaId: z.string().uuid('ID de agenda inválido'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
});

export type GetSlotsQueryDto = z.infer<typeof getSlotsQuerySchema>;
