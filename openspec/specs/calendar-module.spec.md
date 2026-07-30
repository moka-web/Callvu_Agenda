# Google Calendar Integration Specification — Callvu Agenda API

## 1. Overview
The Calendar module SHALL manage external Google Calendar event creation, synchronization, and deletion for appointments (`Turno`).

## 2. Domain Requirements
- **Event Formatting**: Created events MUST construct a summary matching `${agendaNombre} - ${clienteNombre}` and set `start` and `end` times matching the appointment ISO timestamp and duration.
- **Event Identifier Storage**: Successful event creation MUST return `eventId` and optional `htmlLink`, which SHALL be stored in `Turno.googleCalendarEventId`.
- **Cancellation Sync**: When a appointment is cancelled, the corresponding Google Calendar event MUST be deleted by `eventId`.

## 3. Scenarios

### Scenario: Creating Google Calendar Event for a Turno
- **GIVEN** a valid reservation for "Consulta Odontológica" and client "Mariana López" at 10:00 for 45 minutes
- **WHEN** `GoogleCalendarService.createEvent` is called
- **THEN** it MUST calculate start (`10:00`) and end (`10:45`) ISO dates
- **AND** issue an API request to Google Calendar API returning `eventId`.

### Scenario: Deleting Event on Appointment Cancellation
- **GIVEN** a valid Google Calendar `eventId` ("gcal-event-999")
- **WHEN** `GoogleCalendarService.deleteEvent` is invoked
- **THEN** it MUST send a deletion request to Google Calendar API for `primary` calendar.
