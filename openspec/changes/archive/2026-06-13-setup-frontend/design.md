# Design: Frontend Setup

## Technical Approach
We will bootstrap a Next.js App Router application in `apps/web` configured for TypeScript and ESLint, utilizing native CSS Modules for Vanilla CSS styling. Client state will be managed exclusively using the **React Context API** instead of Zustand. Vitest and React Testing Library will be set up to test client components.

## Architecture Decisions

| Decision | Option Selected | Tradeoffs / Alternatives | Rationale |
|---|---|---|---|
| CSS Styling | **CSS Modules (Vanilla CSS)** | Tailwind CSS | Zero external dependency, scoped classes, aligns with global Vanilla CSS requirement. |
| State Management | **React Context API** | Zustand / Redux | Built-in, zero-dependency, and perfect for simple admin/reservations client state. |
| UI Component style | **Custom Vanilla CSS** | Component libraries (shadcn) | Full flexibility, allows applying custom premium micro-animations and typography. |
| Testing environment | **Vitest + JSDOM** | Jest / Playwright | Fast unit tests for React components with native TypeScript support. |

## Data Flow
The Context API will propagate state to client-side components:

```text
       [Next.js Server Component (Fetch / Server Actions)]
                             │
                             ▼ (Props)
       [AppContext.Provider (React Context API - Client)]
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       [Client Component A]          [Client Component B]
        (CSS Modules style)           (CSS Modules style)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `apps/web/package.json` | Create | Next.js configuration and dependency declarations |
| `apps/web/tsconfig.json` | Create | TypeScript compiler options extending workspace root |
| `apps/web/next.config.ts` | Create | Next.js runtime config |
| `apps/web/src/app/globals.css` | Create | Root styles and global Vanilla CSS variables |
| `apps/web/src/app/layout.tsx` | Create | Root layout with custom premium typography imports |
| `apps/web/src/app/page.tsx` | Create | Simple landing page illustrating workspace linkage |
| `apps/web/src/context/AppContext.tsx` | Create | Core React Context for state propagation |
| `apps/web/src/components/Header/Header.tsx` | Create | Custom header component importing types from `@callvu-agenda/shared` |
| `apps/web/src/components/Header/Header.module.css` | Create | Scoped CSS Modules styling for the header |
| `apps/web/vitest.config.ts` | Create | Vitest test workspace runner config |
| `apps/web/src/app/page.test.tsx` | Create | React Testing Library unit test verifying frontend setup |

## Interfaces / Contracts

### React Context contract (`apps/web/src/context/AppContext.tsx`)
```typescript
'use client';

import React, { createContext, useContext, useState } from 'react';
import { Cliente } from '@callvu-agenda/shared';

interface AppContextType {
  activeUser: Cliente | null;
  setActiveUser: (user: Cliente | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<Cliente | null>(null);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Component rendering | React Testing Library checking DOM outputs |
| Integration | Context consumption | RTL wrapping helper context provider |

## Migration / Rollout
No database migrations are needed. Next.js app will build under the Turborepo `build` pipeline, ensuring `@callvu-agenda/shared` compiles first.
