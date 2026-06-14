export interface Cliente {
  id: string;
  nombre: string;
  telefono: string; // WhatsApp
  email?: string;
  createdAt: Date;
}

export interface Agenda {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionSlot: number; // in minutes
  activa: boolean;
  horariosAtencion: HorarioAtencion[];
  createdAt: Date;
}

export interface HorarioAtencion {
  diaSemana: number; // 0 (Domingo) a 6 (Sábado)
  horaInicio: string; // "HH:MM" format
  horaFin: string; // "HH:MM" format
}

export type EstadoTurno = 'pendiente' | 'confirmado' | 'completado' | 'cancelado' | 'no-show';

export interface Turno {
  id: string;
  agendaId: string;
  clienteId: string;
  fechaHora: Date;
  duracion: number; // in minutes
  estado: EstadoTurno;
  googleCalendarEventId?: string;
  createdAt: Date;
}

export interface Slot {
  fechaHora: string; // ISO String
  disponible: boolean;
  agendaId: string;
}
