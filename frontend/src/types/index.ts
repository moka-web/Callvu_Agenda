export interface Agenda {
  id: string;
  nombre: string;
  duracionMinutos: number;
  horaInicio: string; // e.g. "09:00"
  horaFin: string;    // e.g. "18:00"
  diasActivos: number[]; // [1, 2, 3, 4, 5] (1=Monday, 7=Sunday or 0=Sunday)
  creadoEn?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string; // WhatsApp phone e.g. "5491112345678"
  creadoEn?: string;
}

export interface Slot {
  horaInicio: string; // "2026-08-01T09:00:00.000Z"
  horaFin: string;    // "2026-08-01T09:30:00.000Z"
  disponible: boolean;
  razonIndisponible?: string;
}

export interface Turno {
  id: string;
  agendaId: string;
  clienteId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: 'confirmado' | 'cancelado';
  googleEventId?: string | null;
  agenda?: Agenda;
  cliente?: Cliente;
  creadoEn?: string;
}

export interface CreateAgendaPayload {
  nombre: string;
  duracionMinutos: number;
  horaInicio: string;
  horaFin: string;
  diasActivos: number[];
}

export interface CreateClientePayload {
  nombre: string;
  email: string;
  telefono: string;
}

export interface CreateTurnoPayload {
  agendaId: string;
  clienteId: string;
  fechaHoraInicio: string;
}
