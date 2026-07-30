import { Agenda } from '../../types';
import { CreateAgendaDto, UpdateAgendaDto } from './dto/agenda.dto';

export interface IAgendaRepository {
  create(dto: CreateAgendaDto): Promise<Agenda>;
  findById(id: string): Promise<Agenda | null>;
  findAll(): Promise<Agenda[]>;
  update(id: string, dto: UpdateAgendaDto): Promise<Agenda>;
  delete(id: string): Promise<void>;
}
