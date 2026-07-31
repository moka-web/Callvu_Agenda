import React, { useState, useEffect } from 'react';
import type { Agenda, Cliente, Slot, Turno } from '../types';
import { ApiClient } from '../services/api';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Sparkles, Send } from 'lucide-react';

interface ReservaTurnoViewProps {
  onTurnoCreated?: () => void;
}

export const ReservaTurnoView: React.FC<ReservaTurnoViewProps> = ({ onTurnoCreated }) => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string>('');
  const [selectedFecha, setSelectedFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  
  const [loadingAgendas, setLoadingAgendas] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successTurno, setSuccessTurno] = useState<Turno | null>(null);

  // Load Agendas & Clientes on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingAgendas(true);
    try {
      const [ags, cls] = await Promise.all([ApiClient.getAgendas(), ApiClient.getClientes()]);
      setAgendas(ags);
      setClientes(cls);
      if (ags.length > 0) {
        setSelectedAgendaId(ags[0].id);
      }
      if (cls.length > 0) {
        setSelectedClienteId(cls[0].id);
      }
    } catch (err: any) {
      setErrorMsg('No se pudieron cargar las agendas o clientes.');
    } finally {
      setLoadingAgendas(false);
    }
  };

  // Load slots when agenda or date changes
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
    } catch (err: any) {
      setErrorMsg('Error al consultar horarios disponibles.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedAgendaId || !selectedSlot || !selectedClienteId) {
      setErrorMsg('Por favor selecciona un horario y un cliente.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const turno = await ApiClient.createTurno({
        agendaId: selectedAgendaId,
        clienteId: selectedClienteId,
        fechaHoraInicio: selectedSlot.horaInicio
      });
      setSuccessTurno(turno);
      if (onTurnoCreated) onTurnoCreated();
      // Reload slots to show reserved
      loadSlots(selectedAgendaId, selectedFecha);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al reservar el turno.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAgenda = agendas.find(a => a.id === selectedAgendaId);
  const selectedCliente = clientes.find(c => c.id === selectedClienteId);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', justifyContent: 'center' }}>
      
      {/* Left Column: Form Controls */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles className="gradient-text" size={24} />
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Reserva tu Turno</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Selecciona tu servicio y horario deseado</p>
          </div>
        </div>

        {errorMsg && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* 1. Agenda Selection */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Servicio / Agenda</label>
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

        {/* 2. Date Picker */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> Fecha de Atención</label>
          <input
            type="date"
            className="form-input"
            value={selectedFecha}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedFecha(e.target.value)}
          />
        </div>

        {/* 3. Cliente Selection */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> Cliente Solicitante</label>
          <select
            className="form-input"
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.telefono})
              </option>
            ))}
          </select>
        </div>

        {/* Summary Card before confirming */}
        {selectedSlot && selectedAgenda && selectedCliente && (
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-active)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.25rem 0' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Resumen de Reserva</h4>
            <p style={{ fontSize: '0.85rem' }}><strong>Servicio:</strong> {selectedAgenda.nombre}</p>
            <p style={{ fontSize: '0.85rem' }}><strong>Cliente:</strong> {selectedCliente.nombre}</p>
            <p style={{ fontSize: '0.85rem' }}><strong>Horario:</strong> {new Date(selectedSlot.horaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</p>
          </div>
        )}

        <button
          className="gradient-button"
          style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          disabled={!selectedSlot || submitting}
          onClick={handleBooking}
        >
          <Send size={18} /> {submitting ? 'Confirmando Reserva...' : 'Confirmar Turno'}
        </button>
      </div>

      {/* Right Column: Available Slots Grid */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--accent-primary)" /> Horarios Disponibles
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {selectedAgenda ? `${selectedAgenda.nombre} (${selectedAgenda.duracionMinutos} min por turno)` : 'Cargando...'}
        </p>

        {loadingSlots ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Cargando slots de tiempo...
          </div>
        ) : slots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-subtle)' }}>
            <AlertCircle size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No hay horarios disponibles para la fecha seleccionada o la agenda no opera en este día.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
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
                    border: isSelected
                      ? '2px solid var(--accent-primary)'
                      : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'rgba(99, 102, 241, 0.25)'
                      : slot.disponible
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(239, 68, 68, 0.08)',
                    color: isSelected
                      ? '#ffffff'
                      : slot.disponible
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    cursor: slot.disponible ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    fontWeight: isSelected ? '700' : '500',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '0.95rem' }}>{timeFormatted}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.8 }}>
                    {slot.disponible ? 'Disponible' : 'Reservado'}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation Modal / Banner */}
        {successTurno && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--status-success)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.5rem' }}>
              <CheckCircle size={22} />
              <h4 style={{ fontSize: '1rem' }}>¡Turno Confirmado con Éxito!</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Se ha agendado la reserva correctamente en el sistema.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Google Calendar Sincronizado</span>
              <span className="badge badge-info">WhatsApp Notificación Enviada</span>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
);
};
