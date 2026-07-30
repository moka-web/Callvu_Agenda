# Backend Architecture Specification — Callvu Agenda API

## 1. Overview
The Callvu Agenda API SHALL be structured as an autonomous, single-repository REST Backend API built with Express, TypeScript, and Prisma ORM.

## 2. Architectural Boundaries & Patterns
- **Layer Separation**: The application MUST follow a strict 3-tier modular pattern per domain: `Controller` (HTTP & Request handling), `Service` (Domain Logic), and `Repository` (Data Persistence abstraction).
- **ORM Isolation**: The domain business logic in `Service` MUST NOT depend directly on Prisma Client. Data access SHALL be decoupled via `IAgendaRepository` and similar domain interfaces.
- **Runtime DTO Validation**: All incoming HTTP payloads MUST be validated at runtime using Zod schemas before reaching the `Controller` logic.
- **Error Handling**: Invalid request payloads MUST be rejected with a `400 Bad Request` HTTP status containing structured validation issue details.

## 3. Testing & Development Methodology
- **TDD Enforcement**: All domain service methods MUST be developed using Test-Driven Development (TDD) with Vitest. Tests SHALL be written and fail before implementation code is added.

## 4. Scenarios

### Scenario: Validating Incoming Request Body with Zod
- **GIVEN** an HTTP endpoint configured with a Zod validation middleware
- **WHEN** a client sends an HTTP request with missing or invalid fields
- **THEN** the server MUST intercept the request before executing the controller
- **AND** the server SHALL respond with HTTP status `400 Bad Request` and detailed error fields.

### Scenario: Executing Business Logic via Service Layer
- **GIVEN** a valid DTO passed to the `Service` layer
- **WHEN** business rules are evaluated (e.g. start time < end time)
- **THEN** the service SHALL call the repository interface to persist data
- **AND** return the created domain entity.
