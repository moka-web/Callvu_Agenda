import { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import { GestionAgendasView } from './GestionAgendasView';
import { DirectorioClientesView } from './DirectorioClientesView';
import { ListaTurnosView } from './ListaTurnosView';
import { WhatsAppSimulatorView } from './WhatsAppSimulatorView';
import { Clock, Users, PlusCircle, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState<'agendas' | 'clientes' | 'turnos' | 'whatsapp'>('agendas');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ApiClient.checkHealth().then(setIsConnected);
    const interval = setInterval(() => {
      ApiClient.checkHealth().then(setIsConnected);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-gradient-cyan)', padding: '0.6rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Callvu<span className="gradient-text">Admin</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panel de Control de Operadores</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('agendas')}
              className={`secondary-button ${activeTab === 'agendas' ? 'gradient-button' : ''}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', border: 'none' }}
            >
              <Clock size={16} /> Agendas
            </button>

            <button
              onClick={() => setActiveTab('clientes')}
              className={`secondary-button ${activeTab === 'clientes' ? 'gradient-button' : ''}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', border: 'none' }}
            >
              <Users size={16} /> Clientes
            </button>

            <button
              onClick={() => setActiveTab('turnos')}
              className={`secondary-button ${activeTab === 'turnos' ? 'gradient-button' : ''}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', border: 'none' }}
            >
              <PlusCircle size={16} /> Turnos Reservados
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`secondary-button ${activeTab === 'whatsapp' ? 'gradient-button' : ''}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', border: 'none' }}
            >
              <MessageSquare size={16} /> Bot WhatsApp
            </button>
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/reservar" className="secondary-button" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
              <ExternalLink size={15} /> Ver Portal Cliente
            </Link>
            <div className={`badge ${isConnected ? 'badge-success' : 'badge-warning'}`}>
              <span className={`pulse-dot ${isConnected ? 'online' : 'offline'}`} />
              {isConnected ? 'API Conectada' : 'Modo Offline / Mock'}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {activeTab === 'agendas' && <GestionAgendasView />}
        {activeTab === 'clientes' && <DirectorioClientesView />}
        {activeTab === 'turnos' && <ListaTurnosView />}
        {activeTab === 'whatsapp' && <WhatsAppSimulatorView />}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.8)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Callvu Admin Panel © 2026 — Gestión e Integraciones de Turnos
      </footer>

    </div>
  );
};
