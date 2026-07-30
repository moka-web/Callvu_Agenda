import { Router, Request, Response, NextFunction } from 'express';
import { SlotService } from './slot.service';
import { validateQuery } from '../../shared/middlewares/validate-query.middleware';
import { getSlotsQuerySchema } from './dto/slot.dto';

export class SlotController {
  public router: Router;

  constructor(private readonly service: SlotService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', validateQuery(getSlotsQuerySchema), this.getSlots.bind(this));
  }

  private async getSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { agendaId, fecha } = req.query as { agendaId: string; fecha: string };
      const slots = await this.service.calcularSlots(agendaId, fecha);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
