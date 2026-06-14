# Proposal: Backend Architecture Setup

## Intent
Establish a highly performant and type-safe monorepo foundation with a modular Express backend to orchestrate future booking agenda, slots calculation, and integration APIs.

## Scope

### In Scope
- Setup of a pnpm monorepo workspace structure.
- Configuration of Turborepo for task pipeline coordination.
- Setup of `apps/api` workspace with basic Express, modular structure, and TypeScript.
- Setup of `packages/shared` workspace for shared types.
- Initialization of Prisma with PostgreSQL schema structure.
- Configuration of Vitest for workspace-level unit testing.

### Out of Scope
- Implementation of functional business logic (agenda CRUD, slot calculations).
- Setup of `apps/web` (Next.js frontend) or WhatsApp/Google Calendar integrations.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Approach
Initialize the workspace using pnpm workspaces. Configure Turborepo at the root. Set up the Express modular folder structure under `apps/api/src`. Set up Prisma and model schemas. Configure Vitest runners.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Root monorepo configuration |
| `pnpm-workspace.yaml` | New | Workspaces declaration |
| `turbo.json` | New | Pipeline orchestration |
| `apps/api/` | New | Backend application workspace |
| `packages/shared/` | New | Shared types and utils workspace |
| `prisma/` | New | Database schemas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Concurrency overhead | Low | Configure base database locks early in transactions |
| Development sync delays | Low | Leverage Turborepo pipeline cache |

## Rollback Plan
Run `git clean -fd` to remove untracked directories and revert modifications in the root files via `git checkout .`.

## Dependencies
- pnpm package manager installed globally.
- PostgreSQL database access (local or Supabase).

## Success Criteria
- [ ] Monorepo builds successfully via `pnpm build`.
- [ ] Root test script triggers Vitest correctly.
- [ ] Prisma compiles schema successfully.
