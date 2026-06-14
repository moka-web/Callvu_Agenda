# Exploration: Backend Architecture Setup

## Current State
The project is currently empty, containing only a `.git` repository and a `README.md` defining the vision and domain model. The proposed architecture is a monorepo containing `apps/api` (Express-based modular API, planned migration to NestJS), `apps/web` (Next.js with App Router), and `packages/shared` for shared TypeScript definitions. No code, package files, database integrations, or test frameworks have been implemented yet.

## Affected Areas
Since this is the foundation setup, the following new paths will be created:
- `package.json` (root) — workspace and tooling configuration
- `apps/api/` — Express modular backend API
- `packages/shared/` — Shared TypeScript types, utility libraries, and constants
- `turbo.json` or equivalent — build/dev pipeline orchestration if Turborepo is selected
- `tsconfig.json` (root/workspaces) — TypeScript base configs

---

## Approaches for Monorepo & Package Management

### 1. npm Workspaces
Native workspace support provided by npm.
- **Pros**:
  - No external CLI installation needed.
  - Zero config overhead for the package manager.
- **Cons**:
  - Slow dependency installation.
  - No task pipeline orchestration (e.g., parallel builds, cache).
- **Effort**: Low

### 2. pnpm Workspaces + Turborepo (Recommended)
Industry standard for modern TypeScript monorepos.
- **Pros**:
  - Fast dependency installation and hard-linking (saves disk space).
  - Turborepo orchestrates tasks (build, lint, test) with caching.
- **Cons**:
  - Requires pnpm to be installed globally on developers' machines.
  - Additional configuration file (`turbo.json` and `pnpm-workspace.yaml`).
- **Effort**: Medium

---

## Approaches for Database & ORM

### 1. PostgreSQL + Prisma (Recommended)
Relational DB with a highly type-safe ORM.
- **Pros**:
  - Schema-first modeling matches the Agenda domain model perfectly.
  - Auto-generated migrations.
  - Excellent TypeScript support.
- **Cons**:
  - Prisma Client has a slight runtime performance overhead due to its engine.
- **Effort**: Low

### 2. PostgreSQL + Drizzle ORM
SQL-like type-safe ORM.
- **Pros**:
  - Lightweight and highly performant.
  - Generates type-safe SQL queries.
- **Cons**:
  - Less mature schema migrations compared to Prisma.
- **Effort**: Medium

---

## Approaches for Testing Framework

### 1. Vitest (Recommended)
Modern ESM-first test runner.
- **Pros**:
  - Extremely fast execution with worker threads.
  - Out-of-the-box TypeScript support (no ts-jest config needed).
  - Can be shared between Backend and Frontend.
- **Cons**:
  - Newer than Jest, minor compatibility differences for older libraries.
- **Effort**: Low

### 2. Jest
Standard testing framework.
- **Pros**:
  - Mature and widely adopted.
- **Cons**:
  - Requires complex Babel or ts-jest configurations for TypeScript and ESM.
- **Effort**: Medium

---

## Recommendation
We recommend setting up a **pnpm + Turborepo monorepo** with **PostgreSQL + Prisma** and **Vitest**.
This stack provides:
1. Safe transaction handling and strict relations (critical for booking slots and preventing double-booking).
2. Fast monorepo build/test times through Turborepo caching.
3. Unmatched type safety across workspaces using Prisma-generated types exported via `packages/shared`.

## Risks
- **Timezone complexity**: The system deals with slot calculations. We must use UTC internally in the database and convert timezones correctly on client-side and business rules.
- **Concurrency**: Multiple users booking the same slot simultaneously. We must implement database-level transactions or locks when booking a slot.

## Ready for Proposal
Yes. The orchestrator should proceed to define the proposal for initializing the backend monorepo structure.
