import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Home from './page';
import { AppProvider } from '@/context/AppContext';

describe('Frontend Home Page Smoke Test', () => {
  it('renders the header logo and consultorio card details', () => {
    render(
      <AppProvider>
        <Home />
      </AppProvider>
    );

    expect(screen.getByText(/Callvu/i)).toBeInTheDocument();
    expect(screen.getByText(/Agenda Activa/i)).toBeInTheDocument();
    expect(screen.getByText('Consultorio Médico Central')).toBeInTheDocument();
    expect(screen.getByText(/Duración de Slot/i)).toBeInTheDocument();
  });

  it('allows simulating operator login and updating header name', () => {
    render(
      <AppProvider>
        <Home />
      </AppProvider>
    );

    const loginButton = screen.getByRole('button', { name: /Simular Operador/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(screen.getByText(/Mateo González/i)).toBeInTheDocument();

    const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    expect(screen.getByRole('button', { name: /Simular Operador/i })).toBeInTheDocument();
  });
});
