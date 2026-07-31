import { Calendar, Users, Clock, MessageSquare, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'reserva' | 'agendas' | 'clientes' | 'turnos' | 'whatsapp';
  setActiveTab: (tab: 'reserva' | 'agendas' | 'clientes' | 'turnos' | 'whatsapp') => void;
  isConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isConnected }) => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.6rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Callvu<span className="gradient-text">Agenda</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plataforma Inteligente de Turnos</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('reserva')}
            className={`secondary-button ${activeTab === 'reserva' ? 'gradient-button' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
          >
            <Calendar size={16} /> Reservar Turno
          </button>
          
          <button
            onClick={() => setActiveTab('agendas')}
            className={`secondary-button ${activeTab === 'agendas' ? 'gradient-button' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
          >
            <Clock size={16} /> Agendas
          </button>

          <button
            onClick={() => setActiveTab('clientes')}
            className={`secondary-button ${activeTab === 'clientes' ? 'gradient-button' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
          >
            <Users size={16} /> Clientes
          </button>

          <button
            onClick={() => setActiveTab('turnos')}
            className={`secondary-button ${activeTab === 'turnos' ? 'gradient-button' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
          >
            <PlusCircle size={16} /> Mis Turnos
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`secondary-button ${activeTab === 'whatsapp' ? 'gradient-button' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
          >
            <MessageSquare size={16} /> Bot WhatsApp
          </button>
        </nav>

        {/* API Connection Indicator */}
        <div className={`badge ${isConnected ? 'badge-success' : 'badge-warning'}`}>
          <span className={`pulse-dot ${isConnected ? 'online' : 'offline'}`} />
          {isConnected ? 'API Conectada (localhost:3000)' : 'Modo Demostración / Offline'}
        </div>

      </div>
    </header>
  );
};
