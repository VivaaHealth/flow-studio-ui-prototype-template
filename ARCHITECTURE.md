# Flow Studio Lite — Prototyping Architecture

> A rapid prototyping environment for PMs and product designers to vibe-code UI prototypes, airgapped from production data.

---

## Philosophy

This is **NOT** a production app. It's a creative sandbox where:

1. **Speed > Perfection** — Spin up new pages in minutes, not hours
2. **Self-Contained** — All data is local; no external dependencies
3. **Convention-Driven** — Strong patterns make AI-assisted coding reliable
4. **Validation-First** — Tests and linters catch issues before they compound

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Build** | Vite | Lightning-fast HMR, simple config, no SSR complexity |
| **UI** | React 18 | Component model, ecosystem |
| **Routing** | React Router 7 | Client-side routing, file-based not required |
| **Styling** | MUI + Tailwind | Design system compat + utility classes |
| **State** | Zustand | Lightweight, TypeScript-first, devtools |
| **Persistence** | Dexie (IndexedDB) | Client-side database for interaction data |
| **Testing** | Vitest + RTL + Playwright | Fast unit tests, component tests, E2E |
| **Types** | TypeScript (strict) | Catch errors early, better DX |

---

## Directory Structure

```
flow-studio-prototype/
├── index.html                    # Vite entry point
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router + providers setup
│   ├── index.css                 # Global styles + Tailwind
│   │
│   ├── routes/                   # Page components (by feature)
│   │   ├── flows/
│   │   │   ├── flows-page.tsx
│   │   │   └── flow-detail-page.tsx
│   │   ├── agents/
│   │   │   └── agents-page.tsx
│   │   └── placeholder-page.tsx
│   │
│   │   ├── components/
│   │   ├── layout/               # App shell (sidebar, layout)
│   │   │   ├── app-layout.tsx
│   │   │   └── side-navigation.tsx
│   │   ├── ui/                   # Reusable UI primitives
│   │   ├── features/             # Feature-specific components
│   │   └── devtools/             # Prototype development tools
│   │       └── prototype-devtools.tsx
│   │
│   │   ├── lib/
│   │   ├── stores/               # Zustand stores
│   │   │   ├── index.ts
│   │   │   ├── ui-store.ts       # Sidebar, modals, toasts
│   │   │   └── prototype-store.ts # Feature flags, scenarios
│   │   ├── db/                   # IndexedDB via Dexie
│   │   │   └── index.ts          # Database + mutation helpers
│   │   ├── mock-data/
│   │   │   ├── fixtures/         # Baseline data
│   │   │   │   ├── index.ts
│   │   │   │   ├── flows.ts
│   │   │   │   ├── agents.ts
│   │   │   │   ├── organizations.ts
│   │   │   │   └── users.ts
│   │   │   └── factories/        # Data generators (faker.js)
│   │   │       ├── index.ts
│   │   │       ├── flow-factory.ts
│   │   │       └── agent-factory.ts
│   │   ├── hooks/                # Data hooks (useFlows, useAgents)
│   │   │   ├── index.ts
│   │   │   ├── use-flows.ts
│   │   │   └── use-agents.ts
│   │   ├── types/
│   │   │   └── entities.ts       # Domain types + constants
│   │   └── theme/
│   │       └── mui-theme.ts
│   │
│   └── vite-env.d.ts
│
├── tests/
│   ├── setup.ts                  # Test setup (jsdom, mocks)
│   ├── unit/                     # Vitest unit tests
│   │   ├── stores.test.ts
│   │   └── fixtures.test.ts
│   ├── components/               # Component tests (RTL)
│   └── e2e/                      # Playwright E2E tests
│
├── public/                       # Static assets
│   └── images/
│
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.ts
├── .eslintrc.cjs
└── ARCHITECTURE.md
```

---

## Core Systems

### 1. State Management — Zustand

Zustand provides lightweight, TypeScript-first state management with excellent devtools.

**Stores:**

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `uiStore` | Sidebar state, active modals, toasts | localStorage |
| `sessionStore` | Simulated user, permissions, org | localStorage |
| `prototypeStore` | Current scenario, feature flags | localStorage |
| `[feature]Store` | Per-feature state (flows, agents) | IndexedDB |

**Pattern:**

```typescript
// lib/stores/ui-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UIState {
  sidebarCollapsed: boolean
  activeModal: string | null
  // Actions
  toggleSidebar: () => void
  openModal: (id: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      sidebarCollapsed: false,
      activeModal: null,
      
      toggleSidebar: () => set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed
      }),
      openModal: (id) => set((state) => {
        state.activeModal = id
      }),
      closeModal: () => set((state) => {
        state.activeModal = null
      }),
    })),
    { name: 'ui-store' }
  )
)
```

---

### 2. Data Layer — Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Components                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hooks (useFLows, etc.)            │
│  - Combines fixture data + user modifications               │
│  - Provides CRUD operations                                 │
│  - Handles optimistic updates                               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Fixtures      │ │   IndexedDB     │ │   Factories     │
│   (baseline)    │ │   (mutations)   │ │   (generation)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Fixtures** — Static baseline data:

```typescript
// lib/mock-data/fixtures/flows.ts
import type { Flow } from '@/lib/types/entities'

export const flowFixtures: Flow[] = [
  {
    id: 'flow-001',
    name: 'Billing Automation Agent',
    organizationId: 'org-001',
    category: 'rcm',
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-02-03T14:30:00Z',
    // ...
  },
  // ...
]
```

**IndexedDB** — User interactions persisted locally:

```typescript
// lib/db/schema.ts
import Dexie, { Table } from 'dexie'

export interface FlowMutation {
  id: string           // Same as fixture ID, or new UUID
  operation: 'create' | 'update' | 'delete'
  data: Partial<Flow>
  timestamp: number
}

export class PrototypeDB extends Dexie {
  flowMutations!: Table<FlowMutation>
  agentMutations!: Table<AgentMutation>
  
  constructor() {
    super('flow-studio-prototype')
    this.version(1).stores({
      flowMutations: 'id, operation, timestamp',
      agentMutations: 'id, operation, timestamp',
    })
  }
}

export const db = new PrototypeDB()
```

**Factories** — Generate realistic data:

```typescript
// lib/mock-data/factories/flow-factory.ts
import { faker } from '@faker-js/faker'
import type { Flow } from '@/lib/types/entities'

export function createFlow(overrides?: Partial<Flow>): Flow {
  return {
    id: faker.string.uuid(),
    name: faker.company.catchPhrase() + ' Flow',
    organizationId: faker.string.uuid(),
    category: faker.helpers.arrayElement(['rcm', 'authorization', 'callCenter']),
    status: faker.helpers.arrayElement(['draft', 'review', 'published']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    flowRuns: faker.number.int({ min: 0, max: 10000 }),
    ...overrides,
  }
}

export function createFlows(count: number): Flow[] {
  return Array.from({ length: count }, () => createFlow())
}
```

**Custom Hooks** — Merge fixtures + mutations:

```typescript
// lib/hooks/use-flows.ts
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { flowFixtures } from '@/lib/mock-data/fixtures/flows'

export function useFlows() {
  const mutations = useLiveQuery(() => db.flowMutations.toArray())
  
  const flows = useMemo(() => {
    if (!mutations) return flowFixtures
    
    // Apply mutations to fixtures
    const mutationMap = new Map(mutations.map(m => [m.id, m]))
    const result: Flow[] = []
    
    // Process existing fixtures
    for (const fixture of flowFixtures) {
      const mutation = mutationMap.get(fixture.id)
      if (mutation?.operation === 'delete') continue
      if (mutation?.operation === 'update') {
        result.push({ ...fixture, ...mutation.data })
      } else {
        result.push(fixture)
      }
      mutationMap.delete(fixture.id)
    }
    
    // Add created items
    for (const mutation of mutationMap.values()) {
      if (mutation.operation === 'create') {
        result.push(mutation.data as Flow)
      }
    }
    
    return result
  }, [mutations])
  
  const createFlow = async (data: Omit<Flow, 'id'>) => {
    const id = crypto.randomUUID()
    await db.flowMutations.add({
      id,
      operation: 'create',
      data: { ...data, id },
      timestamp: Date.now(),
    })
    return id
  }
  
  const updateFlow = async (id: string, data: Partial<Flow>) => {
    await db.flowMutations.put({
      id,
      operation: 'update',
      data,
      timestamp: Date.now(),
    })
  }
  
  const deleteFlow = async (id: string) => {
    await db.flowMutations.put({
      id,
      operation: 'delete',
      data: {},
      timestamp: Date.now(),
    })
  }
  
  return { flows, createFlow, updateFlow, deleteFlow }
}
```

---

### 3. Testing Infrastructure

**Vitest** — Fast unit tests:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['lib/**', 'components/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**React Testing Library** — Component tests:

```typescript
// tests/components/flows-table.test.tsx
import { render, screen } from '@testing-library/react'
import { FlowsTable } from '@/components/features/flows/flows-table'
import { flowFixtures } from '@/lib/mock-data/fixtures/flows'

describe('FlowsTable', () => {
  it('renders flow names', () => {
    render(<FlowsTable flows={flowFixtures} />)
    expect(screen.getByText('Billing Automation Agent')).toBeInTheDocument()
  })
})
```

**Playwright** — E2E tests:

```typescript
// tests/e2e/flows.spec.ts
import { test, expect } from '@playwright/test'

test('can create a new flow', async ({ page }) => {
  await page.goto('/flows')
  await page.click('text=Create Flow')
  await page.fill('[name="name"]', 'Test Flow')
  await page.click('text=Save')
  await expect(page.locator('text=Test Flow')).toBeVisible()
})
```

---

### 4. Custom ESLint Rules

Enforce prototype conventions:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Enforce design system typography
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material',
            importNames: ['Typography'],
            message: 'Use Text/Title from @vivaahealth/design-system instead.',
          },
        ],
      },
    ],
    
    // Prevent inline mock data in components
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'VariableDeclaration[declarations.0.init.type="ArrayExpression"][declarations.0.id.name=/data|items|list/i]',
        message: 'Move mock data to lib/mock-data/fixtures/',
      },
    ],
  },
}
```

---

### 5. DevTools Panel

A floating panel for prototype controls:

```typescript
// components/devtools/prototype-devtools.tsx
'use client'

import { useState } from 'react'
import { db } from '@/lib/db'
import { usePrototypeStore } from '@/lib/stores/prototype-store'

export function PrototypeDevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const { scenario, setScenario, featureFlags, toggleFlag } = usePrototypeStore()
  
  const resetData = async () => {
    await db.delete()
    window.location.reload()
  }
  
  const loadScenario = async (name: string) => {
    await db.delete()
    // Import and apply scenario
    const scenarios = await import('@/lib/mock-data/scenarios')
    await scenarios[name]?.apply()
    setScenario(name)
  }
  
  if (process.env.NODE_ENV === 'production') return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-900 text-white p-4 rounded-lg shadow-2xl w-80">
          <h3 className="font-bold mb-3">🛠 Prototype DevTools</h3>
          
          <section className="mb-4">
            <h4 className="text-sm text-slate-400 mb-2">Data Scenario</h4>
            <select 
              value={scenario}
              onChange={(e) => loadScenario(e.target.value)}
              className="w-full bg-slate-800 rounded p-2"
            >
              <option value="demo">Demo (default)</option>
              <option value="empty">Empty State</option>
              <option value="stress">Stress Test (1000+ items)</option>
            </select>
          </section>
          
          <section className="mb-4">
            <h4 className="text-sm text-slate-400 mb-2">Feature Flags</h4>
            {Object.entries(featureFlags).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={value}
                  onChange={() => toggleFlag(key)}
                />
                {key}
              </label>
            ))}
          </section>
          
          <button 
            onClick={resetData}
            className="w-full bg-red-600 hover:bg-red-700 rounded p-2 text-sm"
          >
            🗑 Reset All Data
          </button>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-slate-400"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800"
          title="Open DevTools"
        >
          🛠
        </button>
      )}
    </div>
  )
}
```

---

### 6. Form Handling — react-hook-form + zod

Consistent form patterns:

```typescript
// lib/schemas/flow-schema.ts
import { z } from 'zod'

export const flowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  organizationId: z.string().uuid(),
  category: z.enum(['rcm', 'authorization', 'callCenter', 'chartScrubbing']),
  description: z.string().optional(),
})

export type FlowFormData = z.infer<typeof flowSchema>
```

```typescript
// components/features/flows/flow-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flowSchema, type FlowFormData } from '@/lib/schemas/flow-schema'

export function FlowForm({ onSubmit }: { onSubmit: (data: FlowFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FlowFormData>({
    resolver: zodResolver(flowSchema),
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Flow Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      {/* ... */}
    </form>
  )
}
```

---

## Page Patterns

### Standard List Page

```typescript
// app/(routes)/flows/page.tsx
import { FlowsTable } from '@/components/features/flows/flows-table'
import { PageHeader } from '@/components/ui/page-header'

export default function FlowsPage() {
  return (
    <>
      <PageHeader 
        title="Flows"
        actions={[
          { label: 'Explore Templates', variant: 'outlined', href: '/templates' },
          { label: 'Create Flow', variant: 'contained', onClick: () => {} },
        ]}
      />
      <FlowsTable />
    </>
  )
}
```

### Standard Detail Page

```typescript
// app/(routes)/flows/[id]/page.tsx
import { FlowDetail } from '@/components/features/flows/flow-detail'

export default function FlowDetailPage({ params }: { params: { id: string } }) {
  return <FlowDetail flowId={params.id} />
}
```

---

## Scripts

### Generate New Feature

```bash
pnpm gen:feature agents
# Creates:
# - app/(routes)/agents/page.tsx
# - app/(routes)/agents/[id]/page.tsx
# - components/features/agents/agents-table.tsx
# - components/features/agents/agent-detail.tsx
# - lib/mock-data/fixtures/agents.ts
# - lib/mock-data/factories/agent-factory.ts
# - lib/hooks/use-agents.ts
# - lib/types/entities.ts (appends Agent type)
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `zustand` | State management |
| `immer` | Immutable updates |
| `dexie` | IndexedDB wrapper |
| `dexie-react-hooks` | React bindings for Dexie |
| `@faker-js/faker` | Mock data generation |
| `zod` | Schema validation |
| `react-hook-form` | Form handling |
| `@hookform/resolvers` | Zod integration |
| `vitest` | Unit testing |
| `@testing-library/react` | Component testing |
| `playwright` | E2E testing |

---

## Quick Start (New Feature)

1. **Define Types** — `lib/types/entities.ts`
2. **Create Fixtures** — `lib/mock-data/fixtures/[feature].ts`
3. **Create Factory** — `lib/mock-data/factories/[feature]-factory.ts`
4. **Create Hook** — `lib/hooks/use-[feature].ts`
5. **Create Components** — `components/features/[feature]/`
6. **Create Pages** — `app/(routes)/[feature]/`
7. **Add Tests** — `tests/components/[feature].test.tsx`

---

## Conventions Summary

See `CONVENTIONS.md` for detailed coding standards.

**Key rules:**
- Typography: Use `Text`/`Title` from design system, never MUI `Typography`
- Data: All mock data in `lib/mock-data/`, never inline in components
- State: Zustand for global state, React state for local UI
- Forms: react-hook-form + zod for all forms
- Testing: Every new component gets a test file
