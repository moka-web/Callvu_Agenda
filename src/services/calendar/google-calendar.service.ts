import { google } from 'googleapis';
import { CreateCalendarEventDto } from './dto/calendar.dto';

export interface IGoogleCalendarService {
  createEvent(dto: CreateCalendarEventDto): Promise<{ eventId: string; htmlLink?: string }>;
  deleteEvent(eventId: string): Promise<void>;
}

export class GoogleCalendarService implements IGoogleCalendarService {
  private calendarClient: any;

  constructor(calendarClient?: any) {
    if (calendarClient) {
      this.calendarClient = calendarClient;
    } else {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      this.calendarClient = google.calendar({ version: 'v3', auth });
    }
  }

  async createEvent(dto: CreateCalendarEventDto): Promise<{ eventId: string; htmlLink?: string }> {
    const startDate = new Date(dto.fechaHora);
    const endDate = new Date(startDate.getTime() + dto.duracionMinutos * 60 * 1000);

    const eventPayload = {
      summary: `${dto.agendaNombre} - ${dto.clienteNombre}`,
      description: dto.descripcion || 'Turno agendado desde Callvu Agenda',
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: endDate.toISOString(),
      },
    };

    const res = await this.calendarClient.events.insert({
      calendarId: 'primary',
      requestBody: eventPayload,
    });

    return {
      eventId: res.data.id,
      htmlLink: res.data.htmlLink,
    };
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.calendarClient.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}
