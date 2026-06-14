'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Cliente } from '@callvu-agenda/shared';
import styles from './Header.module.css';

export function Header() {
  const { activeUser, setActiveUser } = useApp();

  const handleSimulateLogin = () => {
    const mockUser: Cliente = {
      id: 'usr-123',
      nombre: 'Mateo González',
      telefono: '+5491155554433',
      email: 'mateo@callvu.com',
      createdAt: new Date(),
    };
    setActiveUser(mockUser);
  };

  const handleLogout = () => {
    setActiveUser(null);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <span className={styles.logoHighlight}>Callvu</span> Agenda
      </div>
      
      <nav className={styles.nav}>
        {activeUser ? (
          <div className={styles.userInfo}>
            <span className={styles.welcome}>Hola, <strong>{activeUser.nombre}</strong></span>
            <button className={styles.buttonLogout} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button className={styles.buttonLogin} onClick={handleSimulateLogin}>
            Simular Operador
          </button>
        )}
      </nav>
    </header>
  );
}
