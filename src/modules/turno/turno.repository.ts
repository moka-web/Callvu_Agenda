import { Turno, EstadoTurno } from '../../types';
import { CreateTurnoDto } from './dto/turno.dto';

export interface ITurnoRepository {
  create(dto: CreateTurnoDto & { duracion: number }): Promise<Turno>;
  findById(id: string): Promise<Turno | null>;
  findByAgendaAndFecha(agendaId: string, fechaYYYYMMDD: string): Promise<Turno[]>;
  findByAgenda(agendaId: string): Promise<Turno[]>;
  updateEstado(id: string, estado: EstadoTurno): Promise<Turno>;
  delete(id: string): Promise<void>;
}
