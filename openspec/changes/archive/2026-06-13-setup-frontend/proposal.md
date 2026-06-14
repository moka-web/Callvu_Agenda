# Proposal: Frontend Setup

## Intent
Establish a modern, performant Next.js App Router frontend in `apps/web` to serve as the admin panel and reservations interface, integrated into the monorepo workspace.

## Scope

### In Scope
- Setup of `apps/web` using `create-next-app` (TypeScript, App Router, ESLint, Src directory).
- Integration of the workspace into the root `pnpm` monorepo.
- Configuration of CSS Modules for styling (no Tailwind CSS, in accordance with global rules).
- Wiring of the `@callvu-agenda/shared` dependency to resolve common typings in the frontend.
- Addition of a simple test suite using Vitest + React Testing Library.

### Out of Scope
- Implementation of functional pages or layout designs (Dashboard, Agendas, Turnos).
- Integration with external auth providers (Clerk, NextAuth).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Approach
Run `create-next-app` with `--typescript`, `--eslint`, `--app`, `--src-dir`, `--disable-git`, and `--use-pnpm`. Link `@callvu-agenda/shared` in `apps/web/package.json`. Configure Vitest and CSS Modules.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `apps/web/` | New | Frontend application workspace |
| `package.json` | Modified | Triggers lint/test scripts for web workspace |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Dependency conflict | Low | Explicitly declare shared packages in monorepo using workspace dependencies |

## Rollback Plan
Run `git clean -fd` to remove `apps/web/` and undo root package changes.

## Dependencies
- pnpm package manager installed globally.
- `@callvu-agenda/shared` compiled types.

## Success Criteria
- [ ] Next.js app starts in dev mode via `pnpm --filter @callvu-agenda/web dev`.
- [ ] Shared types are correctly imported in the frontend without build errors.
- [ ] Smoke unit tests pass with Vitest.
