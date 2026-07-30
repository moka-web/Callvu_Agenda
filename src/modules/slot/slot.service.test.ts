import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SlotService } from './slot.service';
import { IAgendaRepository } from '../agenda/agenda.repository';
import { ITurnoRepository } from '../turno/turno.repository';
import { Agenda, Turno } from '../../types';

describe('SlotService — Algoritmo de Cálculo de Slots (TDD)', () => {
  let service: SlotService;
  let mockAgendaRepo: Partial<IAgendaRepository>;
  let mockTurnoRepo: Partial<ITurnoRepository>;

  beforeEach(() => {
    mockAgendaRepo = {
      findById: vi.fn(),
    };
    mockTurnoRepo = {
      findByAgendaAndFecha: vi.fn(),
    };
    service = new SlotService(
      mockAgendaRepo as IAgendaRepository,
      mockTurnoRepo as ITurnoRepository
    );
  });

  it('debe retornar lista vacía si la agenda no existe o está inactiva', async () => {
    const agendaInactiva: Agenda = {
      id: 'agenda-1',
      nombre: 'Agenda Inactiva',
      duracionSlot: 30,
      activa: false,
      horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' }],
      createdAt: new Date(),
    };

    (mockAgendaRepo.findById as any).mockResolvedValue(agendaInactiva);

    const slots = await service.calcularSlots('agenda-1', '2026-08-03'); // Lunes (1)
    expect(slots).toEqual([]);
  });

  it('debe retornar lista vacía si la agenda no atiende el día de la semana solicitado', async () => {
    const agenda: Agenda = {
      id: 'agenda-1',
      nombre: 'Agenda Dental',
      duracionSlot: 30,
      activa: true,
      horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' }], // Solo Lunes
      createdAt: new Date(),
    };

    (mockAgendaRepo.findById as any).mockResolvedValue(agenda);

    const slots = await service.calcularSlots('agenda-1', '2026-08-02'); // Domingo (0)
    expect(slots).toEqual([]);
  });

  it('debe generar los slots correctamente dividiendo el rango de atención según la duración del slot', async () => {
    const agenda: Agenda = {
      id: 'agenda-1',
      nombre: 'Agenda Consultas',
      duracionSlot: 30,
      activa: true,
      horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '10:30' }], // 3 slots: 09:00, 09:30, 10:00
      createdAt: new Date(),
    };

    (mockAgendaRepo.findById as any).mockResolvedValue(agenda);
    (mockTurnoRepo.findByAgendaAndFecha as any).mockResolvedValue([]);

    // 2026-08-03 es Lunes (diaSemana = 1)
    const slots = await service.calcularSlots('agenda-1', '2026-08-03');

    expect(slots).toHaveLength(3);
    expect(slots[0].disponible).toBe(true);
    expect(slots[0].fechaHora).toContain('09:00');
    expect(slots[1].fechaHora).toContain('09:30');
    expect(slots[2].fechaHora).toContain('10:00');
  });

  it('debe marcar disponible: false en los slots que se solapen con un turno reservado', async () => {
    const agenda: Agenda = {
      id: 'agenda-1',
      nombre: 'Agenda Consultas',
      duracionSlot: 30,
      activa: true,
      horariosAtencion: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '10:30' }],
      createdAt: new Date(),
    };

    // Turno reservado de 09:30 a 10:00 el 2026-08-03
    const turnoExistente: Turno = {
      id: 'turno-1',
      agendaId: 'agenda-1',
      clienteId: 'cli-1',
      fechaHora: new Date('2026-08-03T09:30:00.000Z'),
      duracion: 30,
      estado: 'confirmado',
      createdAt: new Date(),
    };

    (mockAgendaRepo.findById as any).mockResolvedValue(agenda);
    (mockTurnoRepo.findByAgendaAndFecha as any).mockResolvedValue([turnoExistente]);

    const slots = await service.calcularSlots('agenda-1', '2026-08-03');

    expect(slots).toHaveLength(3);
    expect(slots[0].disponible).toBe(true);  // 09:00 disponible
    expect(slots[1].disponible).toBe(false); // 09:30 ocupado por turno-1
    expect(slots[2].disponible).toBe(true);  // 10:00 disponible
  });
});
