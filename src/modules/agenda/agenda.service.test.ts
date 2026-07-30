import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgendaService } from './agenda.service';
import { IAgendaRepository } from './agenda.repository';
import { CreateAgendaDto } from './dto/agenda.dto';

describe('AgendaService', () => {
  let service: AgendaService;
  let mockRepository: IAgendaRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new AgendaService(mockRepository);
  });

  describe('createAgenda', () => {
    it('debe crear una agenda exitosamente', async () => {
      const dto: CreateAgendaDto = {
        nombre: 'Consulta Médica General',
        descripcion: 'Atención presencial',
        duracionSlot: 30,
        activa: true,
        horariosAtencion: [
          { diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' },
        ],
      };

      const expectedAgenda = {
        id: 'uuid-1234',
        ...dto,
        createdAt: new Date(),
      };

      vi.spyOn(mockRepository, 'create').mockResolvedValue(expectedAgenda);

      const result = await service.createAgenda(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedAgenda);
    });

    it('debe lanzar un error si la hora de inicio es posterior o igual a la hora de fin', async () => {
      const dtoInvalid: CreateAgendaDto = {
        nombre: 'Agenda Inválida',
        duracionSlot: 30,
        activa: true,
        horariosAtencion: [
          { diaSemana: 1, horaInicio: '18:00', horaFin: '09:00' },
        ],
      };

      await expect(service.createAgenda(dtoInvalid)).rejects.toThrow(
        'La hora de inicio debe ser anterior a la hora de fin'
      );
    });
  });

  describe('getAgendaById', () => {
    it('debe retornar una agenda existente', async () => {
      const mockAgenda = {
        id: 'uuid-1',
        nombre: 'Odontología',
        duracionSlot: 45,
        activa: true,
        horariosAtencion: [],
        createdAt: new Date(),
      };

      vi.spyOn(mockRepository, 'findById').mockResolvedValue(mockAgenda);

      const agenda = await service.getAgendaById('uuid-1');
      expect(agenda).toEqual(mockAgenda);
    });

    it('debe lanzar un error si la agenda no existe', async () => {
      vi.spyOn(mockRepository, 'findById').mockResolvedValue(null);

      await expect(service.getAgendaById('inexistente')).rejects.toThrow(
        'Agenda no encontrada'
      );
    });
  });
});
