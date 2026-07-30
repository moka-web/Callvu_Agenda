import { PrismaClient } from '@prisma/client';
import { Cliente } from '../../types';
import { IClienteRepository } from './cliente.repository';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

export class PrismaClienteRepository implements IClienteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const raw = await this.prisma.cliente.create({
      data: {
        nombre: dto.nombre,
        telefono: dto.telefono,
        email: dto.email || null,
      },
    });

    return {
      ...raw,
      email: raw.email ?? undefined,
    };
  }

  async findById(id: string): Promise<Cliente | null> {
    const raw = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return {
      ...raw,
      email: raw.email ?? undefined,
    };
  }

  async findByTelefono(telefono: string): Promise<Cliente | null> {
    const raw = await this.prisma.cliente.findUnique({
      where: { telefono },
    });

    if (!raw) return null;

    return {
      ...raw,
      email: raw.email ?? undefined,
    };
  }

  async findAll(): Promise<Cliente[]> {
    const list = await this.prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((raw) => ({
      ...raw,
      email: raw.email ?? undefined,
    }));
  }

  async update(id: string, dto: UpdateClienteDto): Promise<Cliente> {
    const raw = await this.prisma.cliente.update({
      where: { id },
      data: {
        ...(dto.nombre && { nombre: dto.nombre }),
        ...(dto.telefono && { telefono: dto.telefono }),
        ...(dto.email !== undefined && { email: dto.email || null }),
      },
    });

    return {
      ...raw,
      email: raw.email ?? undefined,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cliente.delete({
      where: { id },
    });
  }
}
