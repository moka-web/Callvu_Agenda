import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaAgendaRepository } from './modules/agenda/prisma-agenda.repository';
import { AgendaService } from './modules/agenda/agenda.service';
import { AgendaController } from './modules/agenda/agenda.controller';

const app = express();

app.use(cors());
app.use(express.json());

// Infrastructure & Dependency Injection
const prisma = new PrismaClient();
const agendaRepository = new PrismaAgendaRepository(prisma);
const agendaService = new AgendaService(agendaRepository);
const agendaController = new AgendaController(agendaService);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Module routes
app.use('/agendas', agendaController.router);

export default app;
