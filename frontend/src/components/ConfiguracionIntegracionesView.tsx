import React, { useState } from 'react';
import { 
  Key, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Globe, 
  ExternalLink,
  Server,
  RefreshCw
} from 'lucide-react';

export const ConfiguracionIntegracionesView: React.FC = () => {
  // Google Credentials State
  const [googleClientId, setGoogleClientId] = useState('789123456789-abc123def456.apps.googleusercontent.com');
  const [googleClientSecret, setGoogleClientSecret] = useState('GOCSPX-demoSecretKey12345');
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);

  // WhatsApp Credentials State
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('105948372615482');
  const [whatsappToken, setWhatsappToken] = useState('EAAG1234567890abcdefghijklmnopqrstuvwxyz_demoToken');
  const [whatsappVerifyToken, setWhatsappVerifyToken] = useState('callvu_secret_verify_token_2026');
  const [showToken, setShowToken] = useState(false);

  // Admin Account Credentials
  const [adminEmail, setAdminEmail] = useState('admin@callvu.com');
  const [adminPassword, setAdminPassword] = useState('');

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('¡Credenciales e integraciones guardadas exitosamente!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 700);
  };

  const handleToggleGoogle = () => {
    setIsGoogleConnected(!isGoogleConnected);
    setToastMessage(isGoogleConnected ? 'Google Calendar desconectado' : 'Conexión con Google Calendar activada');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, background: 'var(--status-success)', color: '#ffffff', padding: '0.85rem 1.3rem', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 25px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
          Configuración de <span className="gradient-text">Credenciales e Integraciones</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Administrá las llaves de API de Meta, el enlace de Google Calendar y tus datos de acceso operativo.
        </p>
      </div>

      <form onSubmit={handleSaveAll} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        
        {/* GOOGLE CALENDAR INTEGRATION CARD */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                <Calendar size={22} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Google Calendar API</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sincronización OAuth 2.0</p>
              </div>
            </div>
            <div className={`badge ${isGoogleConnected ? 'badge-success' : 'badge-warning'}`}>
              {isGoogleConnected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>

          <div className="form-group">
            <label>Google Client ID</label>
            <input
              type="text"
              className="form-input"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="123456789-xxx.apps.googleusercontent.com"
            />
          </div>

          <div className="form-group">
            <label>Google Client Secret</label>
            <input
              type="password"
              className="form-input"
              value={googleClientSecret}
              onChange={(e) => setGoogleClientSecret(e.target.value)}
              placeholder="GOCSPX-..."
            />
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            🌐 <strong>Redirect URI:</strong> <code style={{ color: 'var(--accent-primary)' }}>http://localhost:3000/oauth2callback</code>
          </div>

          <button
            type="button"
            onClick={handleToggleGoogle}
            className="secondary-button"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} /> {isGoogleConnected ? 'Reconectar / Revocar Acceso' : 'Vincular Google Account'}
          </button>
        </div>

        {/* WHATSAPP BUSINESS CLOUD API CARD */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(37, 211, 102, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                <MessageSquare size={22} color="#25D366" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>WhatsApp Business Cloud API</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Meta Graph API v19.0</p>
              </div>
            </div>
            <div className="badge badge-success">Activo</div>
          </div>

          <div className="form-group">
            <label>Phone Number ID (Meta)</label>
            <input
              type="text"
              className="form-input"
              value={whatsappPhoneId}
              onChange={(e) => setWhatsappPhoneId(e.target.value)}
              placeholder="Ingresá el Phone ID de Meta"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>System User Access Token</label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
              >
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />} {showToken ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            <input
              type={showToken ? 'text' : 'password'}
              className="form-input"
              value={whatsappToken}
              onChange={(e) => setWhatsappToken(e.target.value)}
              placeholder="EAAG..."
            />
          </div>

          <div className="form-group">
            <label>Verify Token (Webhook)</label>
            <input
              type="text"
              className="form-input"
              value={whatsappVerifyToken}
              onChange={(e) => setWhatsappVerifyToken(e.target.value)}
            />
          </div>
        </div>

        {/* ADMIN ACCOUNT CREDENTIALS */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <ShieldCheck size={22} color="#c084fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Credenciales Administrador</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acceso al Panel de Control</p>
            </div>
          </div>

          <div className="form-group">
            <label>Email de Usuario</label>
            <input
              type="email"
              className="form-input"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nueva Contraseña (opcional)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Dejar en blanco para mantener la actual"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="gradient-button"
              disabled={isSaving}
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
            >
              <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Todo'}
            </button>
          </div>
        </div>

        {/* ENVIRONMENT & SYSTEM STATUS */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Server size={22} color="#06b6d4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Estado del Entorno</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configuración de Servidor & BD</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(15,23,42,0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Servidor Express:</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Puerto 3000 (Online)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(15,23,42,0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Base de Datos:</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>PostgreSQL (Prisma CRM)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(15,23,42,0.6)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Documentación API:</span>
              <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Swagger OpenAPI <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
