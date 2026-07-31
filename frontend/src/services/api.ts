import type { Agenda, Cliente, Slot, Turno, CreateAgendaPayload, CreateClientePayload, CreateTurnoPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Mock Initial Data for Offline / Demonstration Mode
const INITIAL_MOCK_AGENDAS: Agenda[] = [
  {
    id: 'ag-1',
    nombre: 'Consultoría Médica General',
    duracionMinutos: 30,
    horaInicio: '09:00',
    horaFin: '17:00',
    diasActivos: [1, 2, 3, 4, 5],
    creadoEn: new Date().toISOString()
  },
  {
    id: 'ag-2',
    nombre: 'Asesoría Técnica Callvu',
    duracionMinutos: 45,
    horaInicio: '10:00',
    horaFin: '16:00',
    diasActivos: [1, 3, 5],
    creadoEn: new Date().toISOString()
  }
];

const INITIAL_MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    nombre: 'María Giménez',
    email: 'maria.gimenez@example.com',
    telefono: '5491155443322',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'cli-2',
    nombre: 'Carlos Benítez',
    email: 'carlos.b@example.com',
    telefono: '5491199887766',
    creadoEn: new Date().toISOString()
  }
];

class StorageManager {
  static getAgendas(): Agenda[] {
    const data = localStorage.getItem('callvu_agendas');
    if (!data) {
      localStorage.setItem('callvu_agendas', JSON.stringify(INITIAL_MOCK_AGENDAS));
      return INITIAL_MOCK_AGENDAS;
    }
    return JSON.parse(data);
  }

  static saveAgendas(agendas: Agenda[]) {
    localStorage.setItem('callvu_agendas', JSON.stringify(agendas));
  }

  static getClientes(): Cliente[] {
    const data = localStorage.getItem('callvu_clientes');
    if (!data) {
      localStorage.setItem('callvu_clientes', JSON.stringify(INITIAL_MOCK_CLIENTES));
      return INITIAL_MOCK_CLIENTES;
    }
    return JSON.parse(data);
  }

  static saveClientes(clientes: Cliente[]) {
    localStorage.setItem('callvu_clientes', JSON.stringify(clientes));
  }

  static getTurnos(): Turno[] {
    const data = localStorage.getItem('callvu_turnos');
    return data ? JSON.parse(data) : [];
  }

  static saveTurnos(turnos: Turno[]) {
    localStorage.setItem('callvu_turnos', JSON.stringify(turnos));
  }
}

export class ApiClient {
  public static isConnected = false;

  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/docs`, { method: 'HEAD', mode: 'cors' });
      this.isConnected = res.ok || res.status === 404 || res.status === 200;
      return true;
    } catch {
      // Try GET agendas
      try {
        const res = await fetch(`${API_BASE_URL}/agendas`);
        this.isConnected = res.ok;
        return res.ok;
      } catch {
        this.isConnected = false;
        return false;
      }
    }
  }

  // Agendas
  public static async getAgendas(): Promise<Agenda[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/agendas`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      this.isConnected = true;
      return data;
    } catch {
      this.isConnected = false;
      return StorageManager.getAgendas();
    }
  }

  public static async createAgenda(payload: CreateAgendaPayload): Promise<Agenda> {
    try {
      const res = await fetch(`${API_BASE_URL}/agendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear agenda');
      }
      this.isConnected = true;
      return await res.json();
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') throw err;
      this.isConnected = false;
      const agendas = StorageManager.getAgendas();
      const newAgenda: Agenda = {
        id: `ag-${Date.now()}`,
        ...payload,
        creadoEn: new Date().toISOString()
      };
      agendas.push(newAgenda);
      StorageManager.saveAgendas(agendas);
      return newAgenda;
    }
  }

  // Clientes
  public static async getClientes(): Promise<Cliente[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/clientes`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      this.isConnected = true;
      return data;
    } catch {
      this.isConnected = false;
      return StorageManager.getClientes();
    }
  }

  public static async createCliente(payload: CreateClientePayload): Promise<Cliente> {
    try {
      const res = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear cliente');
      }
      this.isConnected = true;
      return await res.json();
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') throw err;
      this.isConnected = false;
      const clientes = StorageManager.getClientes();
      const newCliente: Cliente = {
        id: `cli-${Date.now()}`,
        ...payload,
        creadoEn: new Date().toISOString()
      };
      clientes.push(newCliente);
      StorageManager.saveClientes(clientes);
      return newCliente;
    }
  }

  // Slots
  public static async getSlots(agendaId: string, fecha: string): Promise<Slot[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/slots?agendaId=${agendaId}&fecha=${fecha}`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      this.isConnected = true;
      return data;
    } catch {
      this.isConnected = false;
      // Generate slots locally for mock mode
      const agendas = StorageManager.getAgendas();
      const agenda = agendas.find(a => a.id === agendaId);
      if (!agenda) return [];

      const turnos = StorageManager.getTurnos().filter(t => t.agendaId === agendaId && t.estado === 'confirmado');
      
      const slots: Slot[] = [];

      const currentDate = new Date(`${fecha}T${agenda.horaInicio}:00`);
      const endDate = new Date(`${fecha}T${agenda.horaFin}:00`);

      // Check day of week (0=Sun, 1=Mon... in JS Date)
      const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
      if (agenda.diasActivos && !agenda.diasActivos.includes(dayOfWeek)) {
        return []; // Agenda not active on this day
      }

      let curr = new Date(currentDate);
      while (curr < endDate) {
        const slotEnd = new Date(curr.getTime() + agenda.duracionMinutos * 60000);
        if (slotEnd > endDate) break;

        const slotStartIso = curr.toISOString();
        const slotEndIso = slotEnd.toISOString();

        // Check if overlaps existing turnos
        const isOccupied = turnos.some(t => {
          const tStart = new Date(t.fechaHoraInicio).getTime();
          const tEnd = new Date(t.fechaHoraFin).getTime();
          const sStart = curr.getTime();
          const sEnd = slotEnd.getTime();
          return (sStart < tEnd && sEnd > tStart);
        });

        slots.push({
          horaInicio: slotStartIso,
          horaFin: slotEndIso,
          disponible: !isOccupied,
          razonIndisponible: isOccupied ? 'Horario reservado' : undefined
        });

        curr = slotEnd;
      }

      return slots;
    }
  }

  // Turnos
  public static async getTurnos(): Promise<Turno[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/turnos`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      this.isConnected = true;
      return data;
    } catch {
      this.isConnected = false;
      const turnos = StorageManager.getTurnos();
      const agendas = StorageManager.getAgendas();
      const clientes = StorageManager.getClientes();

      return turnos.map(t => ({
        ...t,
        agenda: agendas.find(a => a.id === t.agendaId),
        cliente: clientes.find(c => c.id === t.clienteId)
      }));
    }
  }

  public static async createTurno(payload: CreateTurnoPayload): Promise<Turno> {
    try {
      const res = await fetch(`${API_BASE_URL}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al reservar el turno');
      }
      this.isConnected = true;
      return await res.json();
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') throw err;
      this.isConnected = false;
      const turnos = StorageManager.getTurnos();
      const agendas = StorageManager.getAgendas();
      const clientes = StorageManager.getClientes();

      const agenda = agendas.find(a => a.id === payload.agendaId);
      const cliente = clientes.find(c => c.id === payload.clienteId);

      const start = new Date(payload.fechaHoraInicio);
      const end = new Date(start.getTime() + (agenda?.duracionMinutos || 30) * 60000);

      const newTurno: Turno = {
        id: `tur-${Date.now()}`,
        agendaId: payload.agendaId,
        clienteId: payload.clienteId,
        fechaHoraInicio: start.toISOString(),
        fechaHoraFin: end.toISOString(),
        estado: 'confirmado',
        googleEventId: `gcal-mock-${Date.now()}`,
        agenda,
        cliente,
        creadoEn: new Date().toISOString()
      };

      turnos.push(newTurno);
      StorageManager.saveTurnos(turnos);
      return newTurno;
    }
  }

  public static async cancelTurno(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/turnos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API Error');
      this.isConnected = true;
      return true;
    } catch {
      this.isConnected = false;
      const turnos = StorageManager.getTurnos();
      const updated = turnos.filter(t => t.id !== id);
      StorageManager.saveTurnos(updated);
      return true;
    }
  }

  // Credentials & Config API
  public static async getCredentials(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/config/credentials`);
      if (!res.ok) throw new Error('Error al obtener credenciales');
      this.isConnected = true;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async updateCredentials(payload: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/config/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al actualizar credenciales');
      this.isConnected = true;
      return await res.json();
    } catch {
      return null;
    }
  }

  public static async getGoogleAuthUrl(): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/config/auth/google/url`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.url;
    } catch {
      return null;
    }
  }
}
