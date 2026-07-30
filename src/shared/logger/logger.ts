export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export class Logger {
  private static formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` [${context}]` : '';
    return `${timestamp} [${level}]${ctx}: ${message}`;
  }

  static info(message: string, context?: string): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  static warn(message: string, context?: string): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  static error(message: string, context?: string, stack?: string): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, context));
    if (stack) {
      console.error(stack);
    }
  }

  static debug(message: string, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }
}
