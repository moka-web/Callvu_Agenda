export interface IncomingWhatsAppMessage {
  from: string;
  text: string;
  messageId: string;
}

export class WhatsAppService {
  constructor(
    private readonly verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'default_token',
    private readonly phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    private readonly apiToken = process.env.WHATSAPP_API_TOKEN || '',
    private readonly httpClient?: any
  ) {}

  verifyWebhook(mode?: string, token?: string, challenge?: string): string {
    if (mode === 'subscribe' && token === this.verifyToken && challenge) {
      return challenge;
    }
    throw new Error('Token de verificación de WhatsApp inválido');
  }

  parseIncomingMessage(payload: any): IncomingWhatsAppMessage | null {
    try {
      const entry = payload?.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];

      if (!message || message.type !== 'text') {
        return null;
      }

      return {
        from: message.from,
        text: message.text.body,
        messageId: message.id,
      };
    } catch (error) {
      return null;
    }
  }

  async sendTextMessage(to: string, message: string): Promise<any> {
    const url = `https://graph.facebook.com/v19.0/${this.phoneId}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    if (this.httpClient) {
      const res = await this.httpClient.post(url, body, { headers });
      return res.data;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Fallo al enviar mensaje WhatsApp: ${errText}`);
    }

    return response.json();
  }
}
