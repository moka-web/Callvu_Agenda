import { Router, Request, Response, NextFunction } from 'express';
import { AgendaService } from './agenda.service';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import { createAgendaSchema, updateAgendaSchema } from './dto/agenda.dto';

export class AgendaController {
  public router: Router;

  constructor(private readonly service: AgendaService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', validateBody(createAgendaSchema), this.createAgenda.bind(this));
    this.router.get('/', this.getAllAgendas.bind(this));
    this.router.get('/:id', this.getAgendaById.bind(this));
    this.router.patch('/:id', validateBody(updateAgendaSchema), this.updateAgenda.bind(this));
    this.router.delete('/:id', this.deleteAgenda.bind(this));
  }

  private async createAgenda(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agenda = await this.service.createAgenda(req.body);
      res.status(201).json(agenda);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async getAllAgendas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agendas = await this.service.getAllAgendas();
      res.json(agendas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async getAgendaById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agenda = await this.service.getAgendaById(req.params.id);
      res.json(agenda);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  private async updateAgenda(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agenda = await this.service.updateAgenda(req.params.id, req.body);
      res.json(agenda);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async deleteAgenda(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.deleteAgenda(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
