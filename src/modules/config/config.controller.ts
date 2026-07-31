import { Router, Request, Response } from 'express';
import { ConfigService } from './config.service';

export class ConfigController {
  public router: Router;

  constructor(private configService: ConfigService) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/credentials', this.getCredentials);
    this.router.post('/credentials', this.updateCredentials);
    this.router.get('/auth/google/url', this.getGoogleAuthUrl);
    this.router.get('/oauth2callback', this.handleGoogleCallback);
  }

  private getCredentials = (_req: Request, res: Response) => {
    try {
      const credentials = this.configService.getCredentials();
      res.json(credentials);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener credenciales' });
    }
  };

  private updateCredentials = (req: Request, res: Response) => {
    try {
      const updated = this.configService.updateCredentials(req.body);
      res.json({ message: 'Credenciales actualizadas correctamente', data: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar credenciales' });
    }
  };

  private getGoogleAuthUrl = (_req: Request, res: Response) => {
    try {
      const url = this.configService.getGoogleAuthUrl();
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al generar URL de OAuth de Google' });
    }
  };

  private handleGoogleCallback = async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        res.status(400).send('Código de autorización faltante');
        return;
      }

      await this.configService.handleGoogleCallback(code);
      // Redirect back to admin portal with success flag
      res.redirect('http://localhost:5173/admin?google_connected=true');
    } catch (error: any) {
      res.status(500).send(`Error en la vinculación con Google Calendar: ${error.message}`);
    }
  };
}
