import { PrismaClient } from '@prisma/client';
import { Turno, EstadoTurno } from '../../types';
import { ITurnoRepository } from './turno.repository';
import { CreateTurnoDto } from './dto/turno.dto';

export class PrismaTurnoRepository implements ITurnoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateTurnoDto & { duracion: number }): Promise<Turno> {
    const raw = await this.prisma.turno.create({
      data: {
        agendaId: dto.agendaId,
        clienteId: dto.clienteId,
        fechaHora: new Date(dto.fechaHora),
        duracion: dto.duracion,
        estado: 'confirmado',
      },
    });

    return {
      ...raw,
      estado: raw.estado as EstadoTurno,
      googleCalendarEventId: raw.googleCalendarEventId ?? undefined,
    };
  }

  async findById(id: string): Promise<Turno | null> {
    const raw = await this.prisma.turno.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return {
      ...raw,
      estado: raw.estado as EstadoTurno,
      googleCalendarEventId: raw.googleCalendarEventId ?? undefined,
    };
  }

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

  async findByAgenda(agendaId: string): Promise<Turno[]> {
    const list = await this.prisma.turno.findMany({
      where: { agendaId },
      orderBy: { fechaHora: 'asc' },
    });

    return list.map((raw) => ({
      ...raw,
      estado: raw.estado as EstadoTurno,
      googleCalendarEventId: raw.googleCalendarEventId ?? undefined,
    }));
  }

  async updateEstado(id: string, estado: EstadoTurno): Promise<Turno> {
    const raw = await this.prisma.turno.update({
      where: { id },
      data: { estado },
    });

    return {
      ...raw,
      estado: raw.estado as EstadoTurno,
      googleCalendarEventId: raw.googleCalendarEventId ?? undefined,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.turno.delete({
      where: { id },
    });
  }
}
