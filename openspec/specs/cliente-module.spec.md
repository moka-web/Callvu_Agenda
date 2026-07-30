# Cliente Module Specification — Callvu Agenda API

## 1. Overview
The Cliente module SHALL manage customer profiles, primary contact numbers (WhatsApp), and optional email addresses for appointments.

## 2. Domain Requirements
- **Validation**: A client MUST contain a valid name (minimum 3 characters) and a primary phone number (minimum 8 digits).
- **Phone Uniqueness**: The primary phone number MUST be unique across all clients to prevent duplicate profiles for WhatsApp interactions.
- **Email Format**: If an email address is provided, it MUST conform to valid RFC email address syntax.

## 3. Scenarios

### Scenario: Registering a new valid Cliente
- **GIVEN** a valid client payload with name "Juan Pérez", phone "+5491112345678", and optional email
- **WHEN** `ClienteService.createCliente` is invoked
- **THEN** it MUST verify phone uniqueness via repository
- **AND** persist the client entity and return it with an assigned UUID.

### Scenario: Rejecting duplicate phone number
- **GIVEN** an existing client with phone "+5491187654321" in database
- **WHEN** attempting to create another client with the same phone number
- **THEN** `ClienteService.createCliente` MUST throw an error stating "Un cliente con este teléfono ya existe"
- **AND** data MUST NOT be persisted.

### Scenario: Validating Zod DTO payload at HTTP boundary
- **GIVEN** an HTTP POST request to `/clientes` with a short name ("Al") or invalid phone
- **WHEN** the request hits the Zod validation middleware
- **THEN** the server MUST intercept the request and respond with HTTP status `400 Bad Request`.
