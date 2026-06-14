import React from 'react';
import { Header } from '@/components/Header/Header';
import { Agenda } from '@callvu-agenda/shared';
import styles from './page.module.css';

const mockAgenda: Agenda = {
  id: 'ag-1',
  nombre: 'Consultorio Médico Central',
  descripcion: 'Agenda de turnos para atención clínica general.',
  duracionSlot: 20,
  activa: true,
  horariosAtencion: [
    { diaSemana: 1, horaInicio: '09:00', horaFin: '18:00' },
    { diaSemana: 2, horaInicio: '09:00', horaFin: '18:00' },
    { diaSemana: 3, horaInicio: '09:00', horaFin: '18:00' },
  ],
  createdAt: new Date(),
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Gestión de Agendas e Integraciones
          </h1>
          <p className={styles.subtitle}>
            El frontend web Next.js está conectado al monorepo y comparte contratos de tipos con el backend API y Prisma.
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>Agenda Activa</span>
            <h2>{mockAgenda.nombre}</h2>
            <p className={styles.description}>{mockAgenda.descripcion}</p>
          </div>
          
          <div className={styles.cardBody}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Duración de Slot</span>
              <span className={styles.metricValue}>{mockAgenda.duracionSlot} min</span>
            </div>
            
            <div className={styles.horarios}>
              <h3>Horarios de Atención</h3>
              <ul>
                {mockAgenda.horariosAtencion.map((h, i) => (
                  <li key={i}>
                    {h.diaSemana === 1 ? 'Lunes' : h.diaSemana === 2 ? 'Martes' : 'Miércoles'}: {h.horaInicio} a {h.horaFin} hs
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
