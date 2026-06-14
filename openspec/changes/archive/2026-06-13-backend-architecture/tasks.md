# Tasks: Backend Architecture Setup

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 200-250 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

## Phase 1: Infrastructure & Configuration
- [x] 1.1 Create root `package.json` with monorepo scripts and Turborepo dependency.
- [x] 1.2 Create `pnpm-workspace.yaml` declaring workspaces.
- [x] 1.3 Create root `tsconfig.json` for base TypeScript configuration.
- [x] 1.4 Create `turbo.json` with build, test, lint, and dev pipeline tasks.

## Phase 2: Shared Workspace
- [x] 2.1 Create `packages/shared/package.json` and `packages/shared/tsconfig.json`.
- [x] 2.2 Create `packages/shared/src/index.ts` exporting basic shared types.

## Phase 3: Backend API Setup
- [x] 3.1 Create `apps/api/package.json` and `apps/api/tsconfig.json`.
- [x] 3.2 Create `apps/api/prisma/schema.prisma` defining DB schema configurations.
- [x] 3.3 Create `apps/api/src/app.ts` establishing Express modular baseline.

## Phase 4: Testing & Verification
- [x] 4.1 Create `apps/api/vitest.config.ts` configuring Vitest workspace runners.
- [x] 4.2 Create `apps/api/src/app.test.ts` with a basic Express smoke test.
- [x] 4.3 Run `pnpm install`, `pnpm build` and `pnpm test` to verify setup works.
