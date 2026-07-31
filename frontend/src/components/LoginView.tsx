import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Key, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Demo validation logic
      if (!email || !password) {
        setError('Por favor completá todos los campos.');
        return;
      }

      if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres.');
        return;
      }

      // Successful login
      localStorage.setItem('callvu_admin_session', JSON.stringify({ email, timestamp: Date.now() }));
      onLoginSuccess(email);
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('admin@callvu.com');
    setPassword('admin1234');
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1.5rem' }}>
      
      {/* Background Glow Container */}
      <div style={{ maxWidth: '440px', width: '100%' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-gradient-cyan)', width: '56px', height: '56px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 25px rgba(6,182,212,0.3)' }}>
            <ShieldCheck size={30} color="#ffffff" />
          </div>

          <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Acceso Administrador
          </div>

          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Callvu<span className="gradient-text">Admin</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ingresá con tus credenciales para gestionar agendas e integraciones.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
          
          {/* Visible Demo Credentials Banner */}
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <Key size={16} /> Credenciales de Prueba:
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="badge badge-info"
                style={{ cursor: 'pointer', border: 'none', padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Autocompletar ⚡
              </button>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div><strong>Email:</strong> <code style={{ color: 'var(--text-primary)' }}>admin@callvu.com</code></div>
              <div><strong>Contraseña:</strong> <code style={{ color: 'var(--text-primary)' }}>admin1234</code></div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} color="var(--accent-primary)" /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@callvu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} color="var(--accent-primary)" /> Contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="gradient-button"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.98rem' }}
            >
              {isLoading ? (
                'Verificando credenciales...'
              ) : (
                <>
                  Iniciar Sesión <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Back to Client Landing */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← Volver a la Landing Page
          </Link>
        </div>

      </div>
    </div>
  );
};
