# Flow Studio Prototype

A rapid prototyping environment for Notable product design. Built with Vite + React for lightning-fast iteration.

> ⚠️ **This is a prototype sandbox** — not a production app. All data is local (IndexedDB). No API connections.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Build | **Vite** — instant HMR, no SSR complexity |
| UI | **React 18** + **MUI** + **Tailwind** |
| State | **Zustand** — lightweight, TypeScript-first |
| Persistence | **Dexie** (IndexedDB) — client-side database |
| Testing | **Vitest** + **React Testing Library** + **Playwright** |

---

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Router + providers
├── index.css             # Global styles
├── routes/               # Page components
│   ├── flows/
│   ├── agents/
│   └── placeholder-page.tsx
├── components/
│   ├── layout/           # App shell
│   └── devtools/         # Prototype DevTools panel
└── lib/
    ├── stores/           # Zustand stores
    ├── db/               # IndexedDB setup
    ├── mock-data/        # Fixtures & factories
    ├── hooks/            # Data hooks (useFlows, useAgents)
    └── types/            # TypeScript entities
```

---

## Data Architecture

This prototype uses a **three-tier data system**:

1. **Fixtures** (`lib/mock-data/fixtures/`) — Static baseline data
2. **IndexedDB** (`lib/db/`) — User modifications persisted locally
3. **Factories** (`lib/mock-data/factories/`) — Generate realistic data with faker.js

Custom hooks (`useFlows`, `useAgents`) merge fixtures with mutations to provide a seamless CRUD experience.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run Vitest tests |
| `pnpm test:ui` | Run Vitest with UI |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

---

## DevTools

Press the ⚙️ button in the bottom-right corner (or `Ctrl + .`) to open the **Prototype DevTools** panel:

- Switch data scenarios (demo, empty, stress test)
- Toggle feature flags
- Export/reset all data

---

## Design System Components

### Typography (REQUIRED pattern)

```tsx
// ✅ CORRECT - Use design system components
import { Text, Title } from "@vivaahealth/design-system"

<Title variant="h1">Page Title</Title>
<Text variant="body1">Body text</Text>

// ❌ WRONG - Don't use MUI Typography
import { Typography } from "@mui/material" // ESLint will error
```

### Layout & Forms

```tsx
import { Box, Stack, TextField, Button } from "@mui/material"
import { Alert, Tag, useToast } from "@vivaahealth/design-system"
```

---

## Adding New Features

1. **Define types** → `src/lib/types/entities.ts`
2. **Create fixtures** → `src/lib/mock-data/fixtures/[feature].ts`
3. **Create factory** → `src/lib/mock-data/factories/[feature]-factory.ts`
4. **Create hook** → `src/lib/hooks/use-[feature].ts`
5. **Create route** → `src/routes/[feature]/[feature]-page.tsx`
6. **Add to router** → `src/App.tsx`

See `ARCHITECTURE.md` for detailed patterns.

---

## Prerequisites

1. **pnpm** — Install via `corepack enable pnpm` or `brew install pnpm`
2. **GitHub Packages auth** — Required for `@vivaahealth/design-system`

```bash
npm login --registry=https://npm.pkg.github.com
# Username: your GitHub username
# Password: your personal access token (with read:packages scope)
```

---

## Resources

- **Architecture Guide**: `ARCHITECTURE.md`
- **Design System Storybook**: https://design-systems.story.notablehealth-staging.com
- **MUI Documentation**: https://mui.com/material-ui/
