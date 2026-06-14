# Exploration: Frontend Setup

## Current State
The project currently has a backend workspace (`apps/api`) and a shared workspace (`packages/shared`), coordinated via a pnpm monorepo. No frontend workspace exists under `apps/web`.

## Affected Areas
- `apps/web/` — new workspace created for Next.js App Router application
- `package.json` — root package configuration

---

## Approaches for CSS Styling

### 1. CSS Modules / Vanilla CSS (Recommended)
Use Vanilla CSS and Next.js CSS Modules.
- **Pros**:
  - Maximum flexibility and zero dependency weight.
  - Aligns with the project rule of avoiding Tailwind CSS unless explicitly requested.
  - Scoped styling prevents naming collisions.
- **Cons**:
  - Requires writing more boilerplate CSS.
- **Effort**: Medium

### 2. Tailwind CSS
Use utility-first classes.
- **Pros**:
  - Rapid UI development.
- **Cons**:
  - Forbidden by project rules unless explicitly asked by the user.
- **Effort**: Low

---

## Approaches for State Management & Data Fetching

### 1. React Context API + Fetch (Recommended)
- **Pros**:
  - Built-in, zero external dependency.
  - Straightforward for simple client state propagation in App Router.
- **Cons**:
  - React Context can cause unnecessary re-renders if the state changes frequently (mitigated by keeping Context small and focused).
- **Effort**: Low

### 2. TanStack Query
- **Pros**:
  - Powerful client-side caching and auto-refetching.
- **Cons**:
  - Adds complexity in Next.js App Router where Server Components handle data fetching directly.
- **Effort**: Medium

---

## Recommendation
We recommend initializing `apps/web` with **Next.js 14 (App Router)**, configuring **CSS Modules (Vanilla CSS)** for styling, using **React Context API** for light client state, and executing Server Actions/native fetches for data.

## Risks
- **Monorepo linkage**: Ensuring the frontend correctly resolves type definitions from `@callvu-agenda/shared`.
- **Hydration mismatches**: Since Next.js uses SSR, any UI using client-only variables (like window timezone) must use `useEffect` or dynamic import to avoid hydration issues.

## Ready for Proposal
Yes. Proceeding to proposal.
