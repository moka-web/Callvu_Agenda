import 'dotenv/config';
import app from './app';
import { Logger } from './shared/logger/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`🚀 Servidor ejecutándose en http://localhost:${PORT}`, 'Server');
  Logger.info(`📚 Documentación Swagger UI disponible en http://localhost:${PORT}/docs`, 'Server');
});
