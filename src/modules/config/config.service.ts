import { google } from 'googleapis';

export interface CredentialsConfig {
  whatsappPhoneNumberId?: string;
  whatsappApiToken?: string;
  whatsappVerifyToken?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRedirectUri?: string;
  adminEmail?: string;
}

export class ConfigService {
  private configMemory: CredentialsConfig = {
    whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '105948372615482',
    whatsappApiToken: process.env.WHATSAPP_API_TOKEN || '',
    whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'callvu_secret_verify_token_2026',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@callvu.com',
  };

  private googleTokens: any = null;

  getCredentials(): CredentialsConfig & { isGoogleConnected: boolean; isWhatsappConnected: boolean } {
    return {
      ...this.configMemory,
      // Hide full tokens for security in GET
      whatsappApiToken: this.configMemory.whatsappApiToken ? '••••••••' + this.configMemory.whatsappApiToken.slice(-4) : '',
      googleClientSecret: this.configMemory.googleClientSecret ? '••••••••' : '',
      isGoogleConnected: Boolean(this.googleTokens || (this.configMemory.googleClientId && this.configMemory.googleClientSecret)),
      isWhatsappConnected: Boolean(this.configMemory.whatsappPhoneNumberId && this.configMemory.whatsappApiToken),
    };
  }

  updateCredentials(newConfig: Partial<CredentialsConfig>): CredentialsConfig {
    if (newConfig.whatsappPhoneNumberId !== undefined) this.configMemory.whatsappPhoneNumberId = newConfig.whatsappPhoneNumberId;
    if (newConfig.whatsappApiToken !== undefined && !newConfig.whatsappApiToken.startsWith('••••')) {
      this.configMemory.whatsappApiToken = newConfig.whatsappApiToken;
      process.env.WHATSAPP_API_TOKEN = newConfig.whatsappApiToken;
    }
    if (newConfig.whatsappVerifyToken !== undefined) {
      this.configMemory.whatsappVerifyToken = newConfig.whatsappVerifyToken;
      process.env.WHATSAPP_VERIFY_TOKEN = newConfig.whatsappVerifyToken;
    }
    if (newConfig.googleClientId !== undefined) {
      this.configMemory.googleClientId = newConfig.googleClientId;
      process.env.GOOGLE_CLIENT_ID = newConfig.googleClientId;
    }
    if (newConfig.googleClientSecret !== undefined && !newConfig.googleClientSecret.startsWith('••••')) {
      this.configMemory.googleClientSecret = newConfig.googleClientSecret;
      process.env.GOOGLE_CLIENT_SECRET = newConfig.googleClientSecret;
    }
    if (newConfig.googleRedirectUri !== undefined) {
      this.configMemory.googleRedirectUri = newConfig.googleRedirectUri;
      process.env.GOOGLE_REDIRECT_URI = newConfig.googleRedirectUri;
    }
    if (newConfig.adminEmail !== undefined) {
      this.configMemory.adminEmail = newConfig.adminEmail;
    }

    return this.getCredentials();
  }

  getGoogleAuthUrl(): string {
    const oauth2Client = new google.auth.OAuth2(
      this.configMemory.googleClientId,
      this.configMemory.googleClientSecret,
      this.configMemory.googleRedirectUri || 'http://localhost:3000/oauth2callback'
    );

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async handleGoogleCallback(code: string): Promise<any> {
    const oauth2Client = new google.auth.OAuth2(
      this.configMemory.googleClientId,
      this.configMemory.googleClientSecret,
      this.configMemory.googleRedirectUri || 'http://localhost:3000/oauth2callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    this.googleTokens = tokens;
    return tokens;
  }
}
