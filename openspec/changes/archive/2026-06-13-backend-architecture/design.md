# Design: Backend Architecture Setup

## Technical Approach
We will establish a modern TypeScript monorepo using `pnpm` workspaces for dependency management and `Turborepo` for task orchestration (build, dev, test, lint). The backend API `apps/api` will use modular Express with Prisma for Postgres DB interaction. Types and interfaces shared between frontend and backend will reside in `packages/shared`.

## Architecture Decisions

| Decision | Option Selected | Tradeoffs / Alternatives | Rationale |
|---|---|---|---|
| Monorepo Packaging | **pnpm Workspaces** | npm / Yarn workspaces | pnpm hardlinks packages, reducing disk space usage and speeding up installation. |
| Pipeline Orchestrator | **Turborepo** | Nx / Lerna | Turborepo is zero-config, compiles and runs tasks concurrently, and caches outputs. |
| Database & ORM | **Prisma (PostgreSQL)** | Drizzle / TypeORM | Prisma provides database-independent schemas and auto-generated migrations which fit MVP setup. |
| Test Runner | **Vitest** | Jest | Vitest has native ESM/TypeScript compilation out-of-the-box, running tests in parallel. |

## Data Flow
The data flow is a standard layered structure within the monorepo:

```text
               [apps/web (Next.js)] (future)
                       │
                       ▼ (HTTP Requests)
               [apps/api (Express)]
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
  [modules/services]         [@callvu-agenda/shared]
         │                       (TS definitions)
         ▼
     [Prisma ORM]
         │
         ▼
   [PostgreSQL DB]
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Root configuration of workspaces, turbo dependencies, and scripts |
| `pnpm-workspace.yaml` | Create | Defines apps/ and packages/ directories as workspaces |
| `turbo.json` | Create | Task execution pipeline configurations |
| `tsconfig.json` | Create | Root TypeScript base configuration |
| `packages/shared/package.json` | Create | Workspace configuration for shared code |
| `packages/shared/tsconfig.json` | Create | TypeScript config for shared package |
| `packages/shared/src/index.ts` | Create | Exports shared typings and constants |
| `apps/api/package.json` | Create | Express API package configurations |
| `apps/api/tsconfig.json` | Create | TypeScript config for API workspace |
| `apps/api/prisma/schema.prisma` | Create | Prisma Schema defining Agenda, Turno, Slot, and Cliente models |
| `apps/api/vitest.config.ts` | Create | Vitest test execution config |
| `apps/api/src/app.ts` | Create | Basic Express server entrypoint |
| `apps/api/src/app.test.ts` | Create | Smoke unit test verifying Vitest config |

## Interfaces / Contracts

### Root Workspace config (`package.json`)
```json
{
  "name": "callvu-agenda-root",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### Shared module package (`packages/shared/package.json`)
```json
{
  "name": "@callvu-agenda/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Smoke test on Express setup | Vitest asserting Express instance starts and listens |
| Integration | Prisma connection | Vitest asserting Prisma client instantiates correctly |

## Migration / Rollout
No database migration is required during rollout since this is the initial configuration. Prisma schemas will be compiled using `prisma db push` during local prototyping and `prisma migrate dev` for future production tables setup.

## Open Questions
- None.
