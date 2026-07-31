import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaqView } from '../components/FaqView';
import { 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Bell, 
  CalendarDays,
  Smartphone,
  ChevronRight,
  Target
} from 'lucide-react';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Callvu Agenda — Sistema Inteligente de Reserva de Turnos';
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '0.65rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', margin: 0, lineHeight: 1.2 }}>
                Callvu<span className="gradient-text">Agenda</span>
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Gestión de Turnos Omnicanal</p>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#proposito" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">
              Propósito
            </a>
            <a href="#caracteristicas" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">
              Características
            </a>
            <a href="#como-funciona" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">
              Cómo Funciona
            </a>
            <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="nav-link">
              Preguntas Frecuentes
            </a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link to="/admin" className="secondary-button" id="nav-admin-btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <ShieldCheck size={16} /> Portal Admin
            </Link>
            <Link to="/reservar" className="gradient-button" id="nav-reservar-btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}>
              Reservar Cita <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        
        {/* HERO SECTION */}
        <section style={{ padding: '5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }} id="hero-section">
          <div className="badge badge-info animate-fade-in" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={16} /> Innovación en Gestión de Citas & Turnos 24/7
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15, fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.03em', maxWidth: '900px', margin: '0 auto 1.25rem' }}>
            Agenda Intuitiva y <br />
            <span className="gradient-text">Confirmaciones por WhatsApp</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            <strong>Callvu Agenda</strong> simplifica la reserva de citas para tus clientes y optimiza la atención de tu equipo. Reducí ausencias con recordatorios automáticos y sincronización en tiempo real.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link to="/reservar" className="gradient-button" id="hero-cta-reservar" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
              <CalendarDays size={20} /> Probar Reserva de Turno
            </Link>
            <Link to="/admin" className="secondary-button" id="hero-cta-admin" style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}>
              <ShieldCheck size={20} /> Explorar Panel Admin
            </Link>
          </div>

          {/* Interactive Feature Preview Card */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', background: 'linear-gradient(135deg, rgba(18,26,44,0.85) 0%, rgba(15,23,42,0.95) 100%)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="pulse-dot online"></span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--status-success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sistema Activo en Tiempo Real</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Experiencia fluida para el cliente y el administrador</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Diseñado para integrarse perfectamente con tus flujos de atención. Permite a los clientes elegir servicio, profesional y horario sin fricciones, mientras tu equipo gestiona la agenda desde un solo panel.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" /> Sincronización instantánea de disponibilidad
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" /> Notificaciones automáticas por WhatsApp
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" /> Auditoría de clientes y turnos confirmados
                  </div>
                </div>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(9, 13, 22, 0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} color="#25D366" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notificación de WhatsApp</span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Enviado</span>
                </div>
                <div style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  💬 <em>"¡Hola Juan! Tu turno para Consulta General quedó confirmado para el Martes 15 a las 10:30 hs. Te esperamos."</em>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>📅 Sincronizado con Google Calendar</span>
                  <span>⚡ Respuesta &lt; 1s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section style={{ padding: '4rem 1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }} id="caracteristicas">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Todo lo que necesitás para <span className="gradient-text">gestionar turnos</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                Una arquitectura robusta diseñada para ofrecer flexibilidad, rapidez y confiabilidad.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              
              {/* Feature 1 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Clock size={24} color="var(--accent-primary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Reserva 24/7 Autogestionada</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Tus clientes pueden agendar su cita en cualquier momento del día, seleccionando el servicio y el rango horario disponible en tiempo real.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Smartphone size={24} color="#25D366" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bot & Simulador de WhatsApp</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Confirmación inmediata y recordatorios previos al turno. Integrado con un simulador interactivo para pruebas de comunicación.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={24} color="#a855f7" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Panel de Control Operativo</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Administrá servicios, configurá disponibilidad, bloqueá días festivos y monitoreá el listado completo de turnos en una sola vista.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Users size={24} color="#ec4899" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Directorio de Clientes</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Fichas consolidadas con historial de citas, datos de contacto y observaciones para un seguimiento personalizado.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Bell size={24} color="#06b6d4" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Prevención de Ausencias</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Alertas inteligentes y opciones de cancelación/reprogramación con anticipación para maximizar el uso de tus franjas horarias.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-panel" style={{ padding: '2rem', transition: 'var(--transition-smooth)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Zap size={24} color="#f59e0b" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>API Restful & OpenAPI Spec</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Arquitectura escalable documentada con Swagger/OpenAPI, lista para integrarse con tus sistemas existentes.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }} id="como-funciona">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Paso a Paso</div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>¿Cómo funciona el proceso de reserva?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Un flujo simple diseñado para minimizar clics y maximizar conversiones.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', position: 'relative' }}>
            
            {/* Step 1 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(99, 102, 241, 0.3)', marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Selección de Servicio</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                El cliente navega el catálogo de servicios disponibles y elige el tipo de atención requerida.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(168, 85, 247, 0.3)', marginBottom: '0.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Elección de Horario</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                El sistema valida turnos libres en tiempo real y ofrece las franjas horarias exactas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(236, 72, 153, 0.3)', marginBottom: '0.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Confirmación & WhatsApp</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Se emite la confirmación y se envía el comprobante interactivo directo al celular del cliente.
              </p>
            </div>

          </div>
        </section>

        {/* PROPOSITO SECTION */}
        <section style={{ padding: '5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }} id="proposito">
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                <Target size={14} /> Misión & Propósito
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Nuestro Propósito: <span className="gradient-text">Eliminar la Fricción al Agendar</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 }}>
                Digitalizamos y automatizamos el flujo completo de citas para negocios y profesionales. Conectamos clientes y agendas a través de <strong>WhatsApp Cloud API</strong> y <strong>Google Calendar</strong> en tiempo real, eliminando inasistencias y coordinaciones manuales.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    <Users size={20} color="#60a5fa" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Autonomía 24/7</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  El cliente gestiona su tiempo libremente sin depender de horarios de atención telefónica o respuestas tardías.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(37, 211, 102, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    <Smartphone size={20} color="#25D366" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Comunicación Directa</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Mensajes de confirmación y recordatorios por WhatsApp que garantizan asistencia y comunicación fluida.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    <ShieldCheck size={20} color="#c084fc" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Eficiencia Operativa</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Optimizá el uso de franjas horarias y eliminá errores de solapamiento o dobles reservas en tu equipo.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES (FAQ) SECTION */}
        <section style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }} id="faq">
          <FaqView />
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '4rem 1.5rem 6rem', maxWidth: '1000px', margin: '0 auto' }} id="beneficios">
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--accent-gradient-cyan)', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 800 }}>
                Comenzá a gestionar tus turnos de forma inteligente
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Probá el flujo completo de reserva como cliente o explorá el panel de control administrativo.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/reservar" className="secondary-button" style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700, padding: '0.85rem 2rem', border: 'none' }}>
                  Ir a Reservar Turno <ChevronRight size={18} />
                </Link>
                <Link to="/admin" className="secondary-button" style={{ background: 'rgba(15, 23, 42, 0.4)', color: '#ffffff', fontWeight: 600, padding: '0.85rem 1.75rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                  Ingresar a Admin
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.9)', padding: '2.5rem 1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Calendar size={18} color="var(--accent-primary)" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>Callvu Agenda</span>
            </div>
            <p style={{ fontSize: '0.8rem' }}>© 2026 Callvu Agenda. Plataforma de reserva de citas y gestión de turnos.</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <Link to="/reservar" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Portal Clientes</Link>
            <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Portal Admin</Link>
            <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Documentación OpenAPI</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
