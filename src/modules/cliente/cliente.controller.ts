import { Router, Request, Response, NextFunction } from 'express';
import { ClienteService } from './cliente.service';
import { validateBody } from '../../shared/middlewares/validate.middleware';
import { createClienteSchema, updateClienteSchema } from './dto/cliente.dto';

export class ClienteController {
  public router: Router;

  constructor(private readonly service: ClienteService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', validateBody(createClienteSchema), this.createCliente.bind(this));
    this.router.get('/', this.getAllClientes.bind(this));
    this.router.get('/:id', this.getClienteById.bind(this));
    this.router.patch('/:id', validateBody(updateClienteSchema), this.updateCliente.bind(this));
    this.router.delete('/:id', this.deleteCliente.bind(this));
  }

  private async createCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await this.service.createCliente(req.body);
      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async getAllClientes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientes = await this.service.getAllClientes();
      res.json(clientes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async getClienteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await this.service.getClienteById(req.params.id);
      res.json(cliente);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  private async updateCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await this.service.updateCliente(req.params.id, req.body);
      res.json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async deleteCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.deleteCliente(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
