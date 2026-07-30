# Turno Module Specification — Callvu Agenda API

## 1. Overview
The Turno module SHALL handle appointment reservations, validation of slot availability, conflict prevention, and state transitions.

## 2. Domain Requirements & Validation
- **Existence Verification**: A appointment (`Turno`) MUST reference an existing, active `Agenda` and an existing `Cliente`.
- **Operating Hours Boundary**: The requested `fechaHora` MUST fall strictly within the agenda's operating hours (`horariosAtencion`) for that day of the week.
- **Conflict Prevention**: A new appointment MUST NOT be created if the requested time interval overlaps with any existing non-cancelled `Turno` for the same agenda.
- **State Machine**: Turno status MUST be one of: `'pendiente'`, `'confirmado'`, `'completado'`, `'cancelado'`, `'no-show'`.

## 3. Scenarios

### Scenario: Successfully booking an appointment
- **GIVEN** a valid active agenda, an existing client, and an available slot on a working day/time
- **WHEN** `TurnoService.createTurno` is invoked
- **THEN** it MUST persist the appointment with state `'confirmado'`
- **AND** return the created `Turno` entity.

### Scenario: Rejecting appointment on inactive or non-existent agenda
- **GIVEN** an agenda ID that does not exist or has `activa: false`
- **WHEN** attempting to create a appointment
- **THEN** `TurnoService.createTurno` MUST throw an error stating "La agenda especificada no existe o no está activa".

### Scenario: Rejecting appointment outside operating hours
- **GIVEN** a requested time (e.g. 08:00) outside the agenda's operating hours (09:00 - 17:00)
- **WHEN** `TurnoService.createTurno` is invoked
- **THEN** it MUST throw an error stating "El horario solicitado está fuera de los horarios de atención de la agenda".

### Scenario: Rejecting overlapping appointment
- **GIVEN** an existing confirmed appointment from 10:00 to 10:30
- **WHEN** attempting to book another appointment at 10:00 for the same agenda
- **THEN** `TurnoService.createTurno` MUST throw an error stating "El horario solicitado ya se encuentra reservado".
