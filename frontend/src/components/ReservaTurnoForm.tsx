import { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import type { Agenda, Slot, Turno } from '../types';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Send, Phone, Mail } from 'lucide-react';

export const ReservaTurnoForm = () => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string>('');
  const [selectedFecha, setSelectedFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Client Info Form
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [loadingAgendas, setLoadingAgendas] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successTurno, setSuccessTurno] = useState<Turno | null>(null);

  useEffect(() => {
    loadAgendas();
  }, []);

  const loadAgendas = async () => {
    setLoadingAgendas(true);
    try {
      const data = await ApiClient.getAgendas();
      setAgendas(data);
      if (data.length > 0) {
        setSelectedAgendaId(data[0].id);
      }
    } catch {
      setErrorMsg('No se pudieron cargar los servicios disponibles.');
    } finally {
      setLoadingAgendas(false);
    }
  };

  useEffect(() => {
    if (selectedAgendaId && selectedFecha) {
      loadSlots(selectedAgendaId, selectedFecha);
    }
  }, [selectedAgendaId, selectedFecha]);

  const loadSlots = async (agendaId: string, fecha: string) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    setErrorMsg(null);
    try {
      const result = await ApiClient.getSlots(agendaId, fecha);
      setSlots(result);
    } catch {
      setErrorMsg('Error al consultar horarios disponibles.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgendaId || !selectedSlot) {
      setErrorMsg('Por favor selecciona un horario.');
      return;
    }
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setErrorMsg('Por favor completa tus datos personales (Nombre, Email y Teléfono).');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const clientes = await ApiClient.getClientes();
      let cliente = clientes.find(c => c.telefono === telefono || c.email === email);
      if (!cliente) {
        cliente = await ApiClient.createCliente({ nombre, email, telefono });
      }

      const turno = await ApiClient.createTurno({
        agendaId: selectedAgendaId,
        clienteId: cliente.id,
        fechaHoraInicio: selectedSlot.horaInicio
      });

      setSuccessTurno(turno);
      loadSlots(selectedAgendaId, selectedFecha);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al procesar tu reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAgenda = agendas.find(a => a.id === selectedAgendaId);

  return (
    <div>
      {errorMsg && (
        <div className="badge badge-danger" style={{ width: '100%', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Step 1 & 3: Selection + Client Form */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-primary)" /> 1. Tus Datos y Servicio
          </h3>

          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Servicio o Consulta</label>
              <select
                className="form-input"
                value={selectedAgendaId}
                onChange={(e) => setSelectedAgendaId(e.target.value)}
                disabled={loadingAgendas}
              >
                {agendas.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.nombre} ({ag.duracionMinutos} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> Fecha de Reserva</label>
              <input
                type="date"
                className="form-input"
                value={selectedFecha}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedFecha(e.target.value)}
              />
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.5rem 0' }} />

            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Información de Contacto</h4>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={15} /> Nombre Completo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Laura Martínez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={15} /> Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="laura@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={15} /> WhatsApp / Teléfono</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Ej: 5491112345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="gradient-button"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
              disabled={!selectedSlot || submitting}
            >
              <Send size={18} /> {submitting ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>

        {/* Step 2: Slot Selection */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-primary)" /> 2. Selección de Horario
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {selectedAgenda ? `${selectedAgenda.nombre} (${selectedAgenda.duracionMinutos} min)` : 'Cargando...'}
          </p>

          {loadingSlots ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Buscando horarios disponibles...
            </div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
              <AlertCircle size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No hay horarios disponibles para esta fecha.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {slots.map((slot, idx) => {
                const isSelected = selectedSlot?.horaInicio === slot.horaInicio;
                const timeFormatted = new Date(slot.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <button
                    key={idx}
                    disabled={!slot.disponible}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : slot.disponible ? 'rgba(255, 255, 255, 0.04)' : 'rgba(239, 68, 68, 0.08)',
                      color: isSelected ? '#ffffff' : slot.disponible ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: slot.disponible ? 'pointer' : 'not-allowed',
                      textAlign: 'center',
                      fontWeight: isSelected ? '700' : '500',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem' }}>{timeFormatted}</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.8 }}>
                      {slot.disponible ? 'Libre' : 'Ocupado'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Confirmation Banner */}
          {successTurno && (
            <div style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--status-success)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }} className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.5rem' }}>
                <CheckCircle size={22} />
                <h4 style={{ fontSize: '1rem' }}>¡Tu Reserva fue Confirmada!</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Te enviamos la confirmación al WhatsApp registrado ({telefono}).
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-success">Google Calendar Creado</span>
                <span className="badge badge-info">Notificación WhatsApp Enviada</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
