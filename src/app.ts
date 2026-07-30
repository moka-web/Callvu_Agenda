import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';

// Shared Infrastructure
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { swaggerDocument } from './shared/swagger/swagger.config';

// Agenda Module
import { PrismaAgendaRepository } from './modules/agenda/prisma-agenda.repository';
import { AgendaService } from './modules/agenda/agenda.service';
import { AgendaController } from './modules/agenda/agenda.controller';

// Cliente Module
import { PrismaClienteRepository } from './modules/cliente/prisma-cliente.repository';
import { ClienteService } from './modules/cliente/cliente.service';
import { ClienteController } from './modules/cliente/cliente.controller';

// Turno & Slot Module
import { PrismaTurnoRepository } from './modules/turno/prisma-turno.repository';
import { TurnoService } from './modules/turno/turno.service';
import { TurnoController } from './modules/turno/turno.controller';
import { SlotService } from './modules/slot/slot.service';
import { SlotController } from './modules/slot/slot.controller';

const app = express();

app.use(cors());
app.use(express.json());

// Infrastructure & Dependency Injection
const prisma = new PrismaClient();

// Repositories
const agendaRepository = new PrismaAgendaRepository(prisma);
const clienteRepository = new PrismaClienteRepository(prisma);
const turnoRepository = new PrismaTurnoRepository(prisma);

// Services
const agendaService = new AgendaService(agendaRepository);
const clienteService = new ClienteService(clienteRepository);
const turnoService = new TurnoService(turnoRepository, agendaRepository, clienteRepository);
const slotService = new SlotService(agendaRepository, turnoRepository);

// Controllers
const agendaController = new AgendaController(agendaService);
const clienteController = new ClienteController(clienteService);
const turnoController = new TurnoController(turnoService);
const slotController = new SlotController(slotService);

// Documentation UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Module routes
app.use('/agendas', agendaController.router);
app.use('/clientes', clienteController.router);
app.use('/turnos', turnoController.router);
app.use('/slots', slotController.router);

// Centralized Error Handling Middleware (Must be last)
app.use(errorHandler);

export default app;
