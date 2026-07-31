import { Calendar, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientNavbar = () => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.6rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>Callvu<span className="gradient-text">Agenda</span></h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Portal de Reservas para Clientes</p>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" className="secondary-button" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            Inicio
          </Link>
          <Link to="/admin" className="secondary-button" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            <ShieldCheck size={16} /> Acceso Admin
          </Link>
        </div>
      </div>
    </header>
  );
};
