import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleCalendarService } from './google-calendar.service';
import { CreateCalendarEventDto } from './dto/calendar.dto';

describe('GoogleCalendarService (TDD)', () => {
  let service: GoogleCalendarService;
  let mockCalendarClient: any;

  beforeEach(() => {
    mockCalendarClient = {
      events: {
        insert: vi.fn(),
        delete: vi.fn(),
      },
    };

    service = new GoogleCalendarService(mockCalendarClient);
  });

  describe('createEvent', () => {
    it('debe calcular las fechas de inicio y fin correctamente y crear el evento en Google Calendar', async () => {
      const dto: CreateCalendarEventDto = {
        agendaNombre: 'Consulta Odontológica',
        clienteNombre: 'Mariana López',
        fechaHora: '2026-08-03T10:00:00.000Z',
        duracionMinutos: 45,
      };

      const mockResponse = {
        data: {
          id: 'gcal-event-999',
          htmlLink: 'https://calendar.google.com/event?id=gcal-event-999',
        },
      };

      mockCalendarClient.events.insert.mockResolvedValue(mockResponse);

      const result = await service.createEvent(dto);

      expect(mockCalendarClient.events.insert).toHaveBeenCalledWith({
        calendarId: 'primary',
        requestBody: {
          summary: 'Consulta Odontológica - Mariana López',
          description: 'Turno agendado desde Callvu Agenda',
          start: { dateTime: '2026-08-03T10:00:00.000Z' },
          end: { dateTime: '2026-08-03T10:45:00.000Z' },
        },
      });

      expect(result).toEqual({
        eventId: 'gcal-event-999',
        htmlLink: 'https://calendar.google.com/event?id=gcal-event-999',
      });
    });
  });

  describe('deleteEvent', () => {
    it('debe eliminar el evento de Google Calendar por su eventId', async () => {
      mockCalendarClient.events.delete.mockResolvedValue({ status: 204 });

      await service.deleteEvent('gcal-event-999');

      expect(mockCalendarClient.events.delete).toHaveBeenCalledWith({
        calendarId: 'primary',
        eventId: 'gcal-event-999',
      });
    });
  });
});
