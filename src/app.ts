import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Agenda Module
import { PrismaAgendaRepository } from './modules/agenda/prisma-agenda.repository';
import { AgendaService } from './modules/agenda/agenda.service';
import { AgendaController } from './modules/agenda/agenda.controller';

// Cliente Module
import { PrismaClienteRepository } from './modules/cliente/prisma-cliente.repository';
import { ClienteService } from './modules/cliente/cliente.service';
import { ClienteController } from './modules/cliente/cliente.controller';

// Slot Module
import { PrismaTurnoRepository } from './modules/turno/prisma-turno.repository';
import { SlotService } from './modules/slot/slot.service';
import { SlotController } from './modules/slot/slot.controller';

const app = express();

app.use(cors());
app.use(express.json());

// Infrastructure & Dependency Injection
const prisma = new PrismaClient();

// Agenda
const agendaRepository = new PrismaAgendaRepository(prisma);
const agendaService = new AgendaService(agendaRepository);
const agendaController = new AgendaController(agendaService);

// Cliente
const clienteRepository = new PrismaClienteRepository(prisma);
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

// Slot
const turnoRepository = new PrismaTurnoRepository(prisma);
const slotService = new SlotService(agendaRepository, turnoRepository);
const slotController = new SlotController(slotService);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Module routes
app.use('/agendas', agendaController.router);
app.use('/clientes', clienteController.router);
app.use('/slots', slotController.router);

export default app;
