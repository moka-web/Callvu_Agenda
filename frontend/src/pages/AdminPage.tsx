import { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import { AdminNavbar } from '../components/AdminNavbar';
import { GestionAgendasView } from '../components/GestionAgendasView';
import { DirectorioClientesView } from '../components/DirectorioClientesView';
import { ListaTurnosView } from '../components/ListaTurnosView';
import { WhatsAppSimulatorView } from '../components/WhatsAppSimulatorView';
import { FaqView } from '../components/FaqView';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'agendas' | 'clientes' | 'turnos' | 'whatsapp' | 'faq'>('agendas');
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
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} isConnected={isConnected} />

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {activeTab === 'agendas' && <GestionAgendasView />}
        {activeTab === 'clientes' && <DirectorioClientesView />}
        {activeTab === 'turnos' && <ListaTurnosView />}
        {activeTab === 'whatsapp' && <WhatsAppSimulatorView />}
        {activeTab === 'faq' && <FaqView />}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.8)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Callvu Admin Panel © 2026 — Gestión e Integraciones de Turnos
      </footer>
    </div>
  );
};
