import { Turno, EstadoTurno } from '../../types';
import { ITurnoRepository } from './turno.repository';
import { IAgendaRepository } from '../agenda/agenda.repository';
import { IClienteRepository } from '../cliente/cliente.repository';
import { CreateTurnoDto } from './dto/turno.dto';

export class TurnoService {
  constructor(
    private readonly turnoRepository: ITurnoRepository,
    private readonly agendaRepository: IAgendaRepository,
    private readonly clienteRepository: IClienteRepository
  ) {}

  async createTurno(dto: CreateTurnoDto): Promise<Turno> {
    const agenda = await this.agendaRepository.findById(dto.agendaId);
    if (!agenda || !agenda.activa) {
      throw new Error('La agenda especificada no existe o no está activa');
    }

    const cliente = await this.clienteRepository.findById(dto.clienteId);
    if (!cliente) {
      throw new Error('El cliente especificado no existe');
    }

    const requestedDate = new Date(dto.fechaHora);
    const year = requestedDate.getUTCFullYear();
    const month = String(requestedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(requestedDate.getUTCDate()).padStart(2, '0');
    const fechaYYYYMMDD = `${year}-${month}-${day}`;

    const diaSemana = requestedDate.getUTCDay();
    const horarios = agenda.horariosAtencion.filter((h) => h.diaSemana === diaSemana);
    if (horarios.length === 0) {
      throw new Error('El horario solicitado está fuera de los horarios de atención de la agenda');
    }

    const requestedMinutes = requestedDate.getUTCHours() * 60 + requestedDate.getUTCMinutes();
    const duracion = dto.duracion || agenda.duracionSlot;

    const dentroDeHorario = horarios.some((horario) => {
      const [hIni, mIni] = horario.horaInicio.split(':').map(Number);
      const [hFin, mFin] = horario.horaFin.split(':').map(Number);
      const inicioMin = hIni * 60 + mIni;
      const finMin = hFin * 60 + mFin;

      return requestedMinutes >= inicioMin && requestedMinutes + duracion <= finMin;
    });

    if (!dentroDeHorario) {
      throw new Error('El horario solicitado está fuera de los horarios de atención de la agenda');
    }

    // Comprobar solapamiento de turnos activos
    const turnosExistentes = await this.turnoRepository.findByAgendaAndFecha(
      dto.agendaId,
      fechaYYYYMMDD
    );
    const activeTurnos = turnosExistentes.filter((t) => t.estado !== 'cancelado');

    const reqStartMs = requestedDate.getTime();
    const reqEndMs = reqStartMs + duracion * 60 * 1000;

    const solapado = activeTurnos.some((turno) => {
      const tStartMs = new Date(turno.fechaHora).getTime();
      const tEndMs = tStartMs + turno.duracion * 60 * 1000;

      return Math.max(reqStartMs, tStartMs) < Math.min(reqEndMs, tEndMs);
    });

    if (solapado) {
      throw new Error('El horario solicitado ya se encuentra reservado');
    }

    return this.turnoRepository.create({
      ...dto,
      duracion,
    });
  }

  async getTurnoById(id: string): Promise<Turno> {
    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new Error('Turno no encontrado');
    }
    return turno;
  }

  async getTurnosByAgenda(agendaId: string): Promise<Turno[]> {
    return this.turnoRepository.findByAgenda(agendaId);
  }

  async updateEstadoTurno(id: string, estado: EstadoTurno): Promise<Turno> {
    await this.getTurnoById(id);
    return this.turnoRepository.updateEstado(id, estado);
  }

  async cancelarTurno(id: string): Promise<Turno> {
    return this.updateEstadoTurno(id, 'cancelado');
  }
}
