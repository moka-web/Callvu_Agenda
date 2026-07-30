# Infrastructure Specification — Callvu Agenda API

## 1. Overview
The Infrastructure layer provides cross-cutting concerns: environment configuration, structured logging, centralized error handling, and API documentation UI.

## 2. Requirements
- **Centralized Error Handler**: The server MUST intercept all thrown `AppError` instances and unhandled exceptions using an Express error middleware, returning standardized JSON responses with ISO UTC timestamps.
- **OpenAPI Documentation**: Swagger UI documentation MUST be exposed on `/docs` serving OpenAPI 3.0 specs for all endpoints.
- **Environment Schema**: Server configuration MUST be validated at startup using Zod environment schemas.

## 3. Scenarios

### Scenario: Intercepting custom domain errors
- **GIVEN** an Express handler or middleware throwing a `NotFoundError`
- **WHEN** the exception bubbles to the `errorHandler` middleware
- **THEN** the server MUST respond with HTTP status `404 Not Found`
- **AND** return a JSON body `{ error: "...", statusCode: 404, timestamp: "..." }`.

### Scenario: Serving Swagger UI
- **GIVEN** a running server
- **WHEN** an HTTP GET request is made to `/docs`
- **THEN** the server MUST serve the interactive Swagger UI page documenting `/agendas`, `/clientes`, `/slots`, and `/turnos`.
