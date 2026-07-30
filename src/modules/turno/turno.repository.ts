import { Turno } from '../../types';

export interface ITurnoRepository {
  findByAgendaAndFecha(agendaId: string, fecha: string): Promise<Turno[]>;
}
