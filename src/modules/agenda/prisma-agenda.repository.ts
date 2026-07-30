import { PrismaClient } from '@prisma/client';
import { Agenda, HorarioAtencion } from '../../types';
import { IAgendaRepository } from './agenda.repository';
import { CreateAgendaDto, UpdateAgendaDto } from './dto/agenda.dto';

export class PrismaAgendaRepository implements IAgendaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateAgendaDto): Promise<Agenda> {
    const raw = await this.prisma.agenda.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        duracionSlot: dto.duracionSlot,
        activa: dto.activa,
        horariosAtencion: dto.horariosAtencion as any,
      },
    });

    return {
      ...raw,
      descripcion: raw.descripcion ?? undefined,
      horariosAtencion: raw.horariosAtencion as unknown as HorarioAtencion[],
    };
  }

  async findById(id: string): Promise<Agenda | null> {
    const raw = await this.prisma.agenda.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return {
      ...raw,
      descripcion: raw.descripcion ?? undefined,
      horariosAtencion: raw.horariosAtencion as unknown as HorarioAtencion[],
    };
  }

  async findAll(): Promise<Agenda[]> {
    const list = await this.prisma.agenda.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((raw) => ({
      ...raw,
      descripcion: raw.descripcion ?? undefined,
      horariosAtencion: raw.horariosAtencion as unknown as HorarioAtencion[],
    }));
  }

  async update(id: string, dto: UpdateAgendaDto): Promise<Agenda> {
    const raw = await this.prisma.agenda.update({
      where: { id },
      data: {
        ...(dto.nombre && { nombre: dto.nombre }),
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.duracionSlot && { duracionSlot: dto.duracionSlot }),
        ...(dto.activa !== undefined && { activa: dto.activa }),
        ...(dto.horariosAtencion && { horariosAtencion: dto.horariosAtencion as any }),
      },
    });

    return {
      ...raw,
      descripcion: raw.descripcion ?? undefined,
      horariosAtencion: raw.horariosAtencion as unknown as HorarioAtencion[],
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agenda.delete({
      where: { id },
    });
  }
}
