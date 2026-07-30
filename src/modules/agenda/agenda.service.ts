import { Agenda } from '../../types';
import { IAgendaRepository } from './agenda.repository';
import { CreateAgendaDto, UpdateAgendaDto } from './dto/agenda.dto';

export class AgendaService {
  constructor(private readonly repository: IAgendaRepository) {}

  async createAgenda(dto: CreateAgendaDto): Promise<Agenda> {
    for (const horario of dto.horariosAtencion) {
      if (horario.horaInicio >= horario.horaFin) {
        throw new Error('La hora de inicio debe ser anterior a la hora de fin');
      }
    }
    return this.repository.create(dto);
  }

  async getAgendaById(id: string): Promise<Agenda> {
    const agenda = await this.repository.findById(id);
    if (!agenda) {
      throw new Error('Agenda no encontrada');
    }
    return agenda;
  }

  async getAllAgendas(): Promise<Agenda[]> {
    return this.repository.findAll();
  }

  async updateAgenda(id: string, dto: UpdateAgendaDto): Promise<Agenda> {
    await this.getAgendaById(id);
    if (dto.horariosAtencion) {
      for (const horario of dto.horariosAtencion) {
        if (horario.horaInicio >= horario.horaFin) {
          throw new Error('La hora de inicio debe ser anterior a la hora de fin');
        }
      }
    }
    return this.repository.update(id, dto);
  }

  async deleteAgenda(id: string): Promise<void> {
    await this.getAgendaById(id);
    return this.repository.delete(id);
  }
}
