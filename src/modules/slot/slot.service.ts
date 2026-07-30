import { Slot, Turno } from '../../types';
import { IAgendaRepository } from '../agenda/agenda.repository';
import { ITurnoRepository } from '../turno/turno.repository';

export class SlotService {
  constructor(
    private readonly agendaRepository: IAgendaRepository,
    private readonly turnoRepository: ITurnoRepository
  ) {}

  async calcularSlots(agendaId: string, fechaYYYYMMDD: string): Promise<Slot[]> {
    const agenda = await this.agendaRepository.findById(agendaId);
    if (!agenda || !agenda.activa) {
      return [];
    }

    // Parse YYYY-MM-DD y obtener día de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
    const [year, month, day] = fechaYYYYMMDD.split('-').map(Number);
    const targetDate = new Date(Date.UTC(year, month - 1, day));
    const diaSemana = targetDate.getUTCDay();

    // Filtrar horarios de atención para este día de la semana
    const horarios = agenda.horariosAtencion.filter((h) => h.diaSemana === diaSemana);
    if (horarios.length === 0) {
      return [];
    }

    // Obtener turnos existentes reservado/confirmados para esta agenda en la fecha dada
    const turnosExistentes = await this.turnoRepository.findByAgendaAndFecha(
      agendaId,
      fechaYYYYMMDD
    );

    const activeTurnos = turnosExistentes.filter((t) => t.estado !== 'cancelado');

    const slots: Slot[] = [];

    for (const horario of horarios) {
      const [inicioHora, inicioMin] = horario.horaInicio.split(':').map(Number);
      const [finHora, finMin] = horario.horaFin.split(':').map(Number);

      const startTimeInMinutes = inicioHora * 60 + inicioMin;
      const endTimeInMinutes = finHora * 60 + finMin;
      const slotDuration = agenda.duracionSlot;

      for (
        let currentMinutes = startTimeInMinutes;
        currentMinutes + slotDuration <= endTimeInMinutes;
        currentMinutes += slotDuration
      ) {
        const slotHour = Math.floor(currentMinutes / 60);
        const slotMinute = currentMinutes % 60;

        const slotDate = new Date(
          Date.UTC(year, month - 1, day, slotHour, slotMinute, 0, 0)
        );
        const slotISO = slotDate.toISOString();
        const slotEndMs = slotDate.getTime() + slotDuration * 60 * 1000;

        // Comprobar si algún turno activo se solapa con [slotDate.getTime(), slotEndMs]
        const ocupado = activeTurnos.some((turno) => {
          const turnoStartMs = new Date(turno.fechaHora).getTime();
          const turnoEndMs = turnoStartMs + turno.duracion * 60 * 1000;

          // Solapamiento de intervalos
          return (
            Math.max(slotDate.getTime(), turnoStartMs) <
            Math.min(slotEndMs, turnoEndMs)
          );
        });

        slots.push({
          fechaHora: slotISO,
          disponible: !ocupado,
          agendaId,
        });
      }
    }

    return slots;
  }
}
