import { z } from 'zod';

export const createClienteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  email: z.string().email('El formato del email es inválido').optional().or(z.literal('')),
});

export type CreateClienteDto = z.infer<typeof createClienteSchema>;

export const updateClienteSchema = createClienteSchema.partial();
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>;
