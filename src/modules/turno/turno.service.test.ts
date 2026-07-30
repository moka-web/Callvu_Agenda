import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TurnoService } from './turno.service';
import { ITurnoRepository } from './turno.repository';
import { IAgendaRepository } from '../agenda/agenda.repository';
import { IClienteRepository } from '../cliente/cliente.repository';
import { CreateTurnoDto } from './dto/turno.dto';
import { Agenda, Cliente } from '../../types';

describe('TurnoService — Dominio y Validaciones de Reserva (TDD)', () => {
  let service: TurnoService;
  let mockTurnoRepo: Partial<ITurnoRepository>;
  let mockAgendaRepo: Partial<IAgendaRepository>;
  let mockClienteRepo: Partial<IClienteRepository>;

  const mockAgenda: Agenda = {
    id: 'agenda-uuid-1',
    nombre: 'Consultorio Médico',
    duracionSlot: 30,
    activa: true,
    horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' }], // Lunes
    createdAt: new Date(),
  };

  const mockCliente: Cliente = {
    id: 'cliente-uuid-1',
    nombre: 'Ana Torres',
    telefono: '+5491133334444',
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockTurnoRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByAgendaAndFecha: vi.fn(),
      updateEstado: vi.fn(),
    };
    mockAgendaRepo = {
      findById: vi.fn(),
    };
    mockClienteRepo = {
      findById: vi.fn(),
    };

    service = new TurnoService(
      mockTurnoRepo as ITurnoRepository,
      mockAgendaRepo as IAgendaRepository,
      mockClienteRepo as IClienteRepository
    );
  });

  describe('createTurno', () => {
    it('debe reservar un turno exitosamente si la agenda está activa, el cliente existe y el horario está disponible', async () => {
      // 2026-08-03 es Lunes (diaSemana 1)
      const dto: CreateTurnoDto = {
        agendaId: 'agenda-uuid-1',
        clienteId: 'cliente-uuid-1',
        fechaHora: '2026-08-03T10:00:00.000Z',
      };

      const expectedTurno = {
        id: 'turno-uuid-100',
        agendaId: dto.agendaId,
        clienteId: dto.clienteId,
        fechaHora: new Date(dto.fechaHora),
        duracion: 30,
        estado: 'confirmado' as const,
        createdAt: new Date(),
      };

      (mockAgendaRepo.findById as any).mockResolvedValue(mockAgenda);
      (mockClienteRepo.findById as any).mockResolvedValue(mockCliente);
      (mockTurnoRepo.findByAgendaAndFecha as any).mockResolvedValue([]);
      (mockTurnoRepo.create as any).mockResolvedValue(expectedTurno);

      const result = await service.createTurno(dto);

      expect(mockAgendaRepo.findById).toHaveBeenCalledWith(dto.agendaId);
      expect(mockClienteRepo.findById).toHaveBeenCalledWith(dto.clienteId);
      expect(result).toEqual(expectedTurno);
    });

    it('debe lanzar error si la agenda no existe o está inactiva', async () => {
      const dto: CreateTurnoDto = {
        agendaId: 'agenda-inactiva',
        clienteId: 'cliente-uuid-1',
        fechaHora: '2026-08-03T10:00:00.000Z',
      };

      (mockAgendaRepo.findById as any).mockResolvedValue({ ...mockAgenda, activa: false });

      await expect(service.createTurno(dto)).rejects.toThrow(
        'La agenda especificada no existe o no está activa'
      );
    });

    it('debe lanzar error si la fechaHora solicitada cae fuera de los horarios de atención', async () => {
      // 08:00 está fuera de 09:00 a 17:00
      const dto: CreateTurnoDto = {
        agendaId: 'agenda-uuid-1',
        clienteId: 'cliente-uuid-1',
        fechaHora: '2026-08-03T08:00:00.000Z',
      };

      (mockAgendaRepo.findById as any).mockResolvedValue(mockAgenda);
      (mockClienteRepo.findById as any).mockResolvedValue(mockCliente);

      await expect(service.createTurno(dto)).rejects.toThrow(
        'El horario solicitado está fuera de los horarios de atención de la agenda'
      );
    });

    it('debe lanzar error si el horario solicitado ya está ocupado por otro turno activo', async () => {
      const dto: CreateTurnoDto = {
        agendaId: 'agenda-uuid-1',
        clienteId: 'cliente-uuid-1',
        fechaHora: '2026-08-03T10:00:00.000Z',
      };

      const turnoExistente = {
        id: 'turno-existente',
        agendaId: 'agenda-uuid-1',
        clienteId: 'cliente-otro',
        fechaHora: new Date('2026-08-03T10:00:00.000Z'),
        duracion: 30,
        estado: 'confirmado' as const,
        createdAt: new Date(),
      };

      (mockAgendaRepo.findById as any).mockResolvedValue(mockAgenda);
      (mockClienteRepo.findById as any).mockResolvedValue(mockCliente);
      (mockTurnoRepo.findByAgendaAndFecha as any).mockResolvedValue([turnoExistente]);

      await expect(service.createTurno(dto)).rejects.toThrow(
        'El horario solicitado ya se encuentra reservado'
      );
    });
  });

  describe('updateEstadoTurno', () => {
    it('debe actualizar el estado de un turno existente', async () => {
      const mockTurno = {
        id: 'turno-uuid-1',
        agendaId: 'agenda-uuid-1',
        clienteId: 'cliente-uuid-1',
        fechaHora: new Date(),
        duracion: 30,
        estado: 'confirmado' as const,
        createdAt: new Date(),
      };

      const turnoActualizado = { ...mockTurno, estado: 'completado' as const };

      (mockTurnoRepo.findById as any).mockResolvedValue(mockTurno);
      (mockTurnoRepo.updateEstado as any).mockResolvedValue(turnoActualizado);

      const result = await service.updateEstadoTurno('turno-uuid-1', 'completado');

      expect(mockTurnoRepo.updateEstado).toHaveBeenCalledWith('turno-uuid-1', 'completado');
      expect(result.estado).toBe('completado');
    });
  });
});
