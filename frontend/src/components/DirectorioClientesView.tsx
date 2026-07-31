import React, { useState, useEffect } from 'react';
import type { Cliente, CreateClientePayload } from '../types';
import { ApiClient } from '../services/api';
import { Users, UserPlus, Search, Phone, Mail, AlertCircle } from 'lucide-react';

export const DirectorioClientesView: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getClientes();
      setClientes(data);
    } catch (err) {
      setErrorMsg('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreateClientePayload = { nombre, email, telefono };
      await ApiClient.createCliente(payload);
      setShowModal(false);
      setNombre('');
      setEmail('');
      setTelefono('');
      loadClientes();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Directorio de Clientes</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clientes registrados para reservas telefónicas, web o WhatsApp</p>
        </div>
        <button className="gradient-button" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Registrar Cliente
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          className="form-input"
          style={{ border: 'none', background: 'transparent', padding: '0.25rem' }}
          placeholder="Buscar cliente por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clientes Table/Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando clientes...</div>
      ) : filteredClientes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No se encontraron clientes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredClientes.map((c) => (
            <div key={c.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{c.nombre}</h3>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>WhatsApp Habilitado</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--accent-primary)" />
                  <span>{c.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--status-success)" />
                  <span>{c.telefono}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>ID: {c.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Registrar Nuevo Cliente</h3>

            {errorMsg && (
              <div className="badge badge-danger" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Ana María Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ana.perez@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Número de Teléfono (WhatsApp / Código de País)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ej: 5491112345678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="secondary-button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="gradient-button" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
