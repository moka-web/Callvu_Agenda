import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ShieldCheck, Zap, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  category: 'proposito' | 'problemas' | 'diferencial';
  icon: React.ReactNode;
  answer: React.ReactNode;
}

export const FaqView = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'proposito',
      icon: <HelpCircle color="var(--accent-primary)" size={20} />,
      question: '¿Para qué sirve Callvu Agenda?',
      answer: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
            <strong>Callvu Agenda</strong> es una plataforma inteligente omnicanal de gestión y reserva de turnos diseñada para automatizar el agendamiento de citas sin fricción.
          </p>
          <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            Permite que tus clientes consulten horarios disponibles y confirmen reservas de forma autónoma las 24 horas del día, tanto desde la web como a través de <strong>WhatsApp Cloud API</strong> y <strong>Google Calendar</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'faq-2',
      category: 'problemas',
      icon: <Zap color="var(--status-warning)" size={20} />,
      question: '¿Qué problemas resuelve en tu negocio?',
      answer: (
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: '1.5' }}>
          <li>
            <strong>Pérdida de clientes fuera de horario:</strong> Permite agendar 24/7 sin depender de la atención telefónica o manual.
          </li>
          <li>
            <strong>Solapamientos y doble reserva:</strong> El motor de slots calcula matemáticamente la disponibilidad exacta en tiempo real, bloqueando automáticamente horarios ocupados.
          </li>
          <li>
            <strong>Ausentismo de clientes:</strong> Envía notificaciones instantáneas y recordatorios automatizados por WhatsApp para reducir inasistencias.
          </li>
          <li>
            <strong>Carga administrativa repetitiva:</strong> Elimina la coordinación manual de agendas sincronizando las citas directamente en Google Calendar.
          </li>
        </ul>
      )
    },
    {
      id: 'faq-3',
      category: 'diferencial',
      icon: <Sparkles color="#ec4899" size={20} />,
      question: '¿Cuál es su gran diferencial competitivo?',
      answer: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} /> WhatsApp Cloud API Native
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Integración nativa con webhooks oficiales de Meta para atender clientes por chat de forma conversacional.
            </p>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h5 style={{ color: '#34d399', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> Sync Bidireccional
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Creación inmediata de eventos en Google Calendar con alertas para el profesional y el cliente.
            </p>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h5 style={{ color: '#fbbf24', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Arquitectura Resiliente
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Modo híbrido resiliente que conmuta a almacenamiento local si el servidor backend se encuentra offline.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
          <HelpCircle size={14} /> Centro de Información
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Preguntas <span className="gradient-text">Frecuentes</span>
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Descubrí cómo Callvu Agenda optimiza la gestión de turnos y la atención de tus clientes.
        </p>
      </div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: isOpen ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  background: isOpen ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '1.05rem',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {faq.icon}
                  <span>{faq.question}</span>
                </div>
                {isOpen ? <ChevronUp size={20} color="var(--accent-primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '1rem'
                  }}
                  className="animate-fade-in"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Feature Box */}
      <div style={{ marginTop: '2.5rem', background: 'var(--accent-gradient-cyan)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>¿Listo para probar la experiencia?</h4>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reservá un turno de prueba o gestioná tus agendas desde el panel de control.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <CheckCircle2 size={14} /> 100% Automatizado
          </span>
        </div>
      </div>

    </div>
  );
};
