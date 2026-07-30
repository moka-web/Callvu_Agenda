import { Router, Request, Response, NextFunction } from 'express';
import { WhatsAppService } from './whatsapp.service';

export class WhatsAppController {
  public router: Router;

  constructor(private readonly service: WhatsAppService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.verifyWebhook.bind(this));
    this.router.post('/', this.handleIncomingWebhook.bind(this));
  }

  private verifyWebhook(req: Request, res: Response, next: NextFunction): void {
    try {
      const mode = req.query['hub.mode'] as string;
      const token = req.query['hub.verify_token'] as string;
      const challenge = req.query['hub.challenge'] as string;

      const challengeResponse = this.service.verifyWebhook(mode, token, challenge);
      res.status(200).send(challengeResponse);
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  }

  private async handleIncomingWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = this.service.parseIncomingMessage(req.body);
      if (parsed) {
        console.log(`[WhatsApp Webhook] Mensaje recibido de ${parsed.from}: "${parsed.text}"`);
      }
      res.status(200).json({ status: 'EVENT_RECEIVED' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
