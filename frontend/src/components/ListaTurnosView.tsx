import React, { useState, useEffect } from 'react';
import type { Turno } from '../types';
import { ApiClient } from '../services/api';
import { Calendar, Clock, User, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export const ListaTurnosView: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getTurnos();
      setTurnos(data);
    } catch (err) {
      setErrorMsg('No se pudieron cargar los turnos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTurno = async (id: string) => {
    if (!confirm('¿Estás seguro de cancelar este turno?')) return;
    setCancellingId(id);
    try {
      await ApiClient.cancelTurno(id);
      loadTurnos();
    } catch (err) {
      alert('Error al cancelar el turno.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Control y Lista de Turnos</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reservas activas sincronizadas con Google Calendar y WhatsApp</p>
        </div>
        <button className="secondary-button" onClick={loadTurnos}>
          Actualizar Lista
        </button>
      </div>

      {errorMsg && (
        <div className="badge badge-danger" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando turnos...</div>
      ) : turnos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No hay turnos agendados por el momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {turnos.map((t) => {
            const startDate = new Date(t.fechaHoraInicio);
            const endDate = new Date(t.fechaHoraFin);
            const dateStr = startDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <div key={t.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-success" style={{ marginBottom: '0.35rem' }}>
                        <CheckCircle size={12} /> {t.estado.toUpperCase()}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', textTransform: 'capitalize' }}>{t.agenda?.nombre || 'Agenda general'}</h3>
                    </div>
                    <button
                      className="secondary-button"
                      style={{ padding: '0.4rem', color: 'var(--status-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                      title="Cancelar Turno"
                      disabled={cancellingId === t.id}
                      onClick={() => handleCancelTurno(t.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} color="var(--accent-primary)" />
                      <span><strong>Cliente:</strong> {t.cliente?.nombre || 'Cliente General'} ({t.cliente?.telefono})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="var(--accent-primary)" />
                      <span>{dateStr}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} color="var(--accent-primary)" />
                      <span><strong>Horario:</strong> {timeStr}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      <ExternalLink size={12} /> GCal ID: {t.googleEventId ? 'Sincronizado' : 'Pendiente'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>ID Turno: {t.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
