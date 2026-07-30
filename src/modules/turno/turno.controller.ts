import { Router, Request, Response, NextFunction } from 'express';
import { TurnoService } from './turno.service';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import { createTurnoSchema, updateEstadoTurnoSchema } from './dto/turno.dto';

export class TurnoController {
  public router: Router;

  constructor(private readonly service: TurnoService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', validateBody(createTurnoSchema), this.createTurno.bind(this));
    this.router.get('/:id', this.getTurnoById.bind(this));
    this.router.get('/agenda/:agendaId', this.getTurnosByAgenda.bind(this));
    this.router.patch('/:id/estado', validateBody(updateEstadoTurnoSchema), this.updateEstadoTurno.bind(this));
    this.router.delete('/:id', this.cancelarTurno.bind(this));
  }

  private async createTurno(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const turno = await this.service.createTurno(req.body);
      res.status(201).json(turno);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async getTurnoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const turno = await this.service.getTurnoById(req.params.id);
      res.json(turno);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  private async getTurnosByAgenda(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const turnos = await this.service.getTurnosByAgenda(req.params.agendaId);
      res.json(turnos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async updateEstadoTurno(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const turno = await this.service.updateEstadoTurno(req.params.id, req.body.estado);
      res.json(turno);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async cancelarTurno(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const turno = await this.service.cancelarTurno(req.params.id);
      res.json(turno);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
