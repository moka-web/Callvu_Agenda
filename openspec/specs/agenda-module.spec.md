# Agenda Module Specification — Callvu Agenda API

## 1. Overview
The Agenda module SHALL manage schedule rules, slot durations, and active working hours for professionals or service providers.

## 2. Domain Requirements
- **Creation Requirement**: An agenda MUST contain a valid name (minimum 3 characters), a positive integer slot duration in minutes, and at least one operating hours rule (`HorarioAtencion`).
- **Operating Hours Integrity**: For every operating hours rule, `horaInicio` MUST be chronologically earlier than `horaFin` (format HH:MM).
- **Retrieval Requirement**: The system SHALL allow retrieving agendas by ID or listing all active agendas.

## 3. Scenarios

### Scenario: Creating a valid Agenda
- **GIVEN** a payload with a name of 3+ chars, slot duration > 0, and valid operating hours (`09:00` to `17:00`)
- **WHEN** the `AgendaService.createAgenda` method is invoked
- **THEN** it MUST persist the agenda via the repository
- **AND** return the created `Agenda` object with an assigned UUID and timestamp.

### Scenario: Rejecting invalid operating hours in Agenda creation
- **GIVEN** an operating hours rule where `horaInicio` is `18:00` and `horaFin` is `09:00`
- **WHEN** `AgendaService.createAgenda` is invoked
- **THEN** it MUST throw a domain validation error stating "La hora de inicio debe ser anterior a la hora de fin"
- **AND** data MUST NOT be persisted.

### Scenario: Retrieving an Agenda by ID
- **GIVEN** an existing agenda ID in the repository
- **WHEN** `AgendaService.getAgendaById` is called with that ID
- **THEN** it MUST return the matching agenda entity.

### Scenario: Requesting a non-existent Agenda ID
- **GIVEN** an agenda ID that does not exist in the database
- **WHEN** `AgendaService.getAgendaById` is called
- **THEN** it MUST throw an error stating "Agenda no encontrada".
