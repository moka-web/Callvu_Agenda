# Slot Calculation Module Specification — Callvu Agenda API

## 1. Overview
The Slot module SHALL calculate discrete available time blocks (`Slot`) for a specified agenda on a given target date (`YYYY-MM-DD`).

## 2. Domain Rules & Algorithm Requirements
- **Inactive Agenda**: If the agenda is marked `activa: false` or does not exist, the calculation MUST return an empty list `[]`.
- **Operating Hours Matching**: Slots MUST only be generated for intervals defined in `Agenda.horariosAtencion` that match the target date's day of week (0: Sunday .. 6: Saturday).
- **Time Window Segmentation**: Starting at `horaInicio`, consecutive time windows of duration `duracionSlot` minutes MUST be calculated up to `horaFin`.
- **Overlap Detection**: For each calculated slot window `[slotStart, slotEnd]`, if any existing non-cancelled `Turno` for that agenda overlaps with the interval, the slot MUST be marked `disponible: false`. Otherwise, `disponible: true`.

## 3. Scenarios

### Scenario: Calculating slots for an active agenda without existing bookings
- **GIVEN** an active agenda with operating hours on Monday from 09:00 to 10:00 and 30-minute slot duration
- **WHEN** `SlotService.calcularSlots` is called for a Monday date
- **THEN** it MUST return 2 slots (09:00 and 09:30)
- **AND** both slots MUST have `disponible: true`.

### Scenario: Marking booked slots as unavailable
- **GIVEN** an active agenda and an existing confirmed `Turno` at 09:30 for 30 minutes
- **WHEN** `SlotService.calcularSlots` is called for that date
- **THEN** the slot at 09:00 MUST be `disponible: true`
- **AND** the slot at 09:30 MUST be `disponible: false`.

### Scenario: Validating query params via HTTP API
- **GIVEN** an HTTP GET request to `/slots` with invalid `agendaId` or invalid date format (`03-08-2026`)
- **WHEN** the request reaches `validateQuery` middleware
- **THEN** the server MUST respond with HTTP status `400 Bad Request` and validation error details.
