import { ClientNavbar } from '../components/ClientNavbar';
import { ReservaTurnoForm } from '../components/ReservaTurnoForm';
import { FaqView } from '../components/FaqView';
import { Sparkles } from 'lucide-react';

export const ClientPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientNavbar />

      <main style={{ flex: 1, maxWidth: '980px', width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Reserva Inmediata 24/7
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Agendá tu Cita en <span className="gradient-text">Segundos</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
            Elegí el servicio, seleccioná la fecha y confirmá tu horario. Recibirás recordatorio por WhatsApp y Google Calendar.
          </p>
        </div>

        {/* Booking Form */}
        <ReservaTurnoForm />

        {/* Section Divider */}
        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4rem 0 3rem' }} />

        {/* FAQ Section */}
        <div id="faq">
          <FaqView />
        </div>

      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.8)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Callvu Agenda © 2026 — Reserva de Turnos en Línea
      </footer>
    </div>
  );
};
