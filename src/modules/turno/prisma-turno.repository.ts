import { PrismaClient } from '@prisma/client';
import { Turno, EstadoTurno } from '../../types';
import { ITurnoRepository } from './turno.repository';

export class PrismaTurnoRepository implements ITurnoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAgendaAndFecha(agendaId: string, fechaYYYYMMDD: string): Promise<Turno[]> {
    const [year, month, day] = fechaYYYYMMDD.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const list = await this.prisma.turno.findMany({
      where: {
        agendaId,
        fechaHora: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return list.map((raw) => ({
      ...raw,
      estado: raw.estado as EstadoTurno,
      googleCalendarEventId: raw.googleCalendarEventId ?? undefined,
    }));
  }
}
