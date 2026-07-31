import React, { useState, useEffect } from 'react';
import type { Agenda, CreateAgendaPayload } from '../types';
import { ApiClient } from '../services/api';
import { Clock, Plus, Calendar, AlertCircle } from 'lucide-react';

const DIAS_SEMANA = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' },
  { id: 7, label: 'Dom' }
];

export const GestionAgendasView: React.FC = () => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState(30);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [diasActivos, setDiasActivos] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    loadAgendas();
  }, []);

  const loadAgendas = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAgendas();
      setAgendas(data);
    } catch (err) {
      setErrorMsg('No se pudieron cargar las agendas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayId: number) => {
    if (diasActivos.includes(dayId)) {
      setDiasActivos(diasActivos.filter(d => d !== dayId));
    } else {
      setDiasActivos([...diasActivos, dayId].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('El nombre de la agenda es obligatorio.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreateAgendaPayload = {
        nombre,
        duracionMinutos,
        horaInicio,
        horaFin,
        diasActivos
      };
      await ApiClient.createAgenda(payload);
      setShowModal(false);
      // Reset form
      setNombre('');
      loadAgendas();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la agenda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Gestión de Agendas</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Configuración de servicios, duración y horarios de atención</p>
        </div>
        <button className="gradient-button" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nueva Agenda
        </button>
      </div>

      {/* Agendas Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando agendas...</div>
      ) : agendas.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No hay agendas registradas aún.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {agendas.map((ag) => (
            <div key={ag.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>{ag.nombre}</h3>
                  <span className="badge badge-info">{ag.duracionMinutos} min</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--accent-primary)" />
                    <span>Horario: <strong>{ag.horaInicio} - {ag.horaFin} hs</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--accent-primary)" />
                    <span>Días activos:</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {DIAS_SEMANA.map((d) => {
                    const isActive = ag.diasActivos?.includes(d.id);
                    return (
                      <span
                        key={d.id}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                          border: isActive ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                          fontWeight: isActive ? '600' : '400'
                        }}
                      >
                        {d.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-success">Activa</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {ag.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Crear Nueva Agenda</h3>

            {errorMsg && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Servicio / Agenda</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Odontología General"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duración por Turno (minutos)</label>
                <select
                  className="form-input"
                  value={duracionMinutos}
                  onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                >
                  <option value={15}>15 Minutos</option>
                  <option value={30}>30 Minutos</option>
                  <option value={45}>45 Minutos</option>
                  <option value={60}>60 Minutos</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Hora Inicio</label>
                  <input
                    type="time"
                    className="form-input"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Hora Fin</label>
                  <input
                    type="time"
                    className="form-input"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Días de Atención</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {DIAS_SEMANA.map((d) => {
                    const selected = diasActivos.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleDayToggle(d.id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: selected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                          color: selected ? '#ffffff' : 'var(--text-muted)'
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="gradient-button" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
