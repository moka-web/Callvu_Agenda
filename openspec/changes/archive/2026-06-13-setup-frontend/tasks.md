# Tasks: Frontend Setup

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

## Phase 1: Bootstrapping Next.js Application
- [x] 1.1 Execute `npx create-next-app` to scaffold `apps/web` with typescript, app router, eslint, and src directory settings.
- [x] 1.2 Modify `apps/web/package.json` to link `@callvu-agenda/shared` workspace dependency.
- [x] 1.3 Create `apps/web/tsconfig.json` extending root typescript config.

## Phase 2: App & Global Configs
- [x] 2.1 Create nextjs config file `apps/web/next.config.ts`.
- [x] 2.2 Create `apps/web/src/app/globals.css` defining Vanilla CSS global properties.
- [x] 2.3 Create `apps/web/src/app/layout.tsx` with base metadata.

## Phase 3: React Context & Components
- [x] 3.1 Create `apps/web/src/context/AppContext.tsx` with React Context state handlers.
- [x] 3.2 Create custom header `apps/web/src/components/Header/Header.tsx` using shared types.
- [x] 3.3 Create scoped style file `apps/web/src/components/Header/Header.module.css`.
- [x] 3.4 Create landing placeholder page `apps/web/src/app/page.tsx`.

## Phase 4: Testing & Verification
- [x] 4.1 Create `apps/web/vitest.config.ts` configuring jsdom test environment.
- [x] 4.2 Create React Testing Library smoke unit test in `apps/web/src/app/page.test.tsx`.
- [x] 4.3 Verify workspace test executions via `pnpm test`.
