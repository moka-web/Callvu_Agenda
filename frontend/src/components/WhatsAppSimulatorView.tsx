import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Bot, CheckCheck, Zap } from 'lucide-react';
import { ApiClient } from '../services/api';
import type { Agenda } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const WhatsAppSimulatorView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '🤖 *Bienvenido al asistente de turnos Callvu*\n\nEscribe:\n1️⃣ Ver Agendas Disponibles\n2️⃣ Consultar mis Turnos\n3️⃣ Hablar con un Asesor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [agendas, setAgendas] = useState<Agenda[]>([]);

  useEffect(() => {
    ApiClient.getAgendas().then(setAgendas);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: nowStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate bot processing logic (mimicking WhatsApp Webhook service)
    setTimeout(() => {
      let botReplyText = '';

      if (userText === '1' || userText.toLowerCase().includes('agenda') || userText.toLowerCase().includes('turnos')) {
        const agendasList = agendas.map((a, i) => `${i + 1}. *${a.nombre}* (${a.duracionMinutos} min, ${a.horaInicio}-${a.horaFin})`).join('\n');
        botReplyText = `📋 *Agendas Disponibles:*\n\n${agendasList || '1. Consultoría Médica General (30 min)\n2. Asesoría Técnica Callvu (45 min)'}\n\nEscribe el número de la agenda para consultar horarios de hoy.`;
      } else if (userText === '2' || userText.toLowerCase().includes('mis turnos')) {
        botReplyText = '📅 Para consultar tus turnos actuales o cancelar una reserva, ingresa al portal de *Callvu Agenda Web*.';
      } else if (userText === '3' || userText.toLowerCase().includes('asesor')) {
        botReplyText = '💬 Un operador de Callvu se comunicará con vos a la brevedad. ¡Gracias por contactarnos!';
      } else {
        botReplyText = `Entendido. Recibimos tu mensaje: "${userText}".\n\nSi deseas agendar un turno, dinos la fecha o selecciona una de las agendas.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      
      {/* Information Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <MessageSquare className="gradient-text" size={24} />
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Simulador de Bot WhatsApp</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prueba la integración del webhook de Meta (WhatsApp Cloud API)</p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Este simulador imita las llamadas entrantes a la ruta <code style={{ color: 'var(--accent-primary)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /webhooks/whatsapp</code> de la API backend.
        </p>

        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} /> Capacidades del Bot:
          </h4>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Responde 200 EVENT_RECEIVED a la plataforma Meta</li>
            <li>Procesa textos entrantes y mapea respuestas automatizadas</li>
            <li>Conecta con la lógica de cálculo de slots y reserva de turnos</li>
          </ul>
        </div>
      </div>

      {/* Phone / Chat Interface */}
      <div className="glass-panel" style={{ padding: '1rem', background: '#0b141a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', maxWidth: '420px', margin: '0 auto', width: '100%' }}>
        
        {/* Chat Top Header */}
        <div style={{ background: '#202c33', padding: '0.75rem 1rem', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="white" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#e9edef' }}>Callvu Bot Oficial</h4>
            <p style={{ fontSize: '0.72rem', color: '#8696a0' }}>en línea • WhatsApp Business API</p>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ height: '380px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0b141a' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? '#005c4b' : '#202c33',
                color: '#e9edef',
                padding: '0.65rem 0.85rem',
                borderRadius: m.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                fontSize: '0.88rem',
                whiteSpace: 'pre-line',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <div>{m.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.35rem', fontSize: '0.68rem', color: '#8696a0' }}>
                <span>{m.timestamp}</span>
                {m.sender === 'user' && <CheckCheck size={14} color="#53bdeb" />}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: '#202c33', borderRadius: '0 0 16px 16px' }}>
          <input
            type="text"
            className="form-input"
            style={{ background: '#2a3942', border: 'none', borderRadius: '20px', color: '#e9edef', fontSize: '0.9rem' }}
            placeholder="Escribe 1, 2 o un mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" style={{ background: '#00a884', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Send size={18} />
          </button>
        </form>

      </div>

    </div>
  );
};
