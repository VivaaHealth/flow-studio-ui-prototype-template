# Flow Studio UI Prototype Base

A lightweight prototyping environment for Notable product design, using a subset of the monorepo's design system.

> ⚠️ **This is "Notable Light"** — a simplified environment for rapid prototyping. It intentionally excludes the full monorepo infrastructure (auth, API, utilities) to enable quick iteration on UI designs.

---

## Quick Reference

### What's Available

| Category | Source | Components |
|----------|--------|------------|
| **Typography** | `@vivaahealth/design-system` | `Text`, `Title` |
| **Feedback** | `@vivaahealth/design-system` | `Alert`, `Tag`, `Loader`, `useToast` |
| **Icons** | `@vivaahealth/design-system` | `Icon.*` (AlertTriangle, X, Trash2, Upload, Mail, etc.) |
| **Dialog** | `@vivaahealth/design-system` | `Dialog` (with Icon prop for confirmation dialogs) |
| **Form** | `@vivaahealth/design-system` | `FormField`, `Switch`, `RadioButton` |
| **Tokens** | `@vivaahealth/design-system` | `colors` |
| **Layout** | `@mui/material` | `Box`, `Stack`, `Grid`, `Container` |
| **Buttons** | `@mui/material` | `Button`, `IconButton`, `ToggleButton`, `Chip` |
| **Form Controls** | `@mui/material` | `TextField`, `Select`, `Checkbox`, `Autocomplete` |
| **Data Display** | `@mui/material` | `Table*`, `TablePagination`, `Card*` |
| **Navigation** | `@mui/material` | `Tabs`, `Tab`, `Menu`, `MenuItem`, `Drawer`, `Link` |
| **Feedback** | `@mui/material` | `CircularProgress`, `Skeleton`, `Tooltip` |
| **Other Icons** | `@mui/icons-material` | Full MUI icon set |
| **Lucide Icons** | `lucide-react` | Modern icon set (ChevronDown, Search, Plus, etc.) |

### What's NOT Available (Monorepo Only)

| Category | What You're Missing |
|----------|---------------------|
| **Agent Icons** | Custom SVG icons (`RcmAgentSvg`, `AuthorizationAgentSvg`, `CallCenterAgentSvg`, etc.) — use MUI icons as approximations |
| **Common Utilities** | `isDefined`, `isTruthy`, `parseError`, `getQueryProps` — implement simple versions locally |
| **API Clients** | `api.client.*` — use dummy data instead |
| **Auth Context** | `useLoggedInAuthContext`, `useAuthContext`, `hasPermission` — mock as needed |
| **Layout Components** | `StandardPageLayout`, `StandardPageBody`, `ActionBar`, `CrudPageBody` — build simplified versions |
| **Table Components** | `NotableTable`, `NotableDataGrid` — use MUI `Table` directly |
| **Form Controls** | `TextFieldControl`, `SelectFieldControl`, `TypeaheadControl` — use MUI components directly |
| **Links** | `UserLink`, `PracticeLink`, `FlowLink`, etc. — use plain MUI `Link` |
| **React Query** | `useFindOneByIdQuery`, `useFindAllQuery` — use local state with dummy data |
| **Feature Flags** | `useFlag`, `FeatureFlagKey` — hardcode values for prototypes |

---

## Version Alignment

This repo uses the same dependency versions as the Notable monorepo:

| Package | Version |
|---------|---------|
| `@vivaahealth/design-system` | `^6.0.17` |
| `@mui/material` | `^7.2.0` |
| `@mui/icons-material` | `^7.2.0` |
| `@emotion/react` | `^11.14.0` |
| `@emotion/styled` | `^11.14.1` |
| `react` | `^18.3.1` |
| `react-dom` | `^18.3.1` |
| `next` | `14.2.16` |

---

## Usage Patterns

### Typography (REQUIRED pattern)

```tsx
// ✅ CORRECT - Use design system components
import { Text, Title } from "@vivaahealth/design-system"

<Title variant="h1">Page Title</Title>
<Text variant="body1">Body text</Text>
<Text variant="title-large" bold>Section header</Text>

// ❌ WRONG - Don't use MUI Typography
import { Typography } from "@mui/material" // Blocked by monorepo eslint
```

### Alerts and Feedback

```tsx
import { Alert, Tag, useToast } from "@vivaahealth/design-system"

// Alert variants: "info" | "warning" | "danger" | "success"
<Alert variant="warning" title="Warning">Something needs attention</Alert>

// Tags (status indicators)
<Tag color="success">Active</Tag>
<Tag color="warning">Pending</Tag>
<Tag color="error">Failed</Tag>

// Toast notifications
const toast = useToast()
toast.showSuccess("Saved successfully")
toast.showError("Something went wrong")
```

### Icons

```tsx
// Design system icons (preferred for consistency)
import { Icon } from "@vivaahealth/design-system"
<Icon.AlertTriangle size="large" color="#FFAE00" />
<Icon.X size="medium" />
<Icon.Trash2 />

// MUI icons (full library available)
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"

// Lucide icons (modern, clean)
import { ChevronDown, Search, Plus } from "lucide-react"
```

### Layout

```tsx
import { Box, Stack } from "@mui/material"

<Stack direction="row" spacing={2} alignItems="center">
  <Box sx={{ flex: 1 }}>Content</Box>
  <Button>Action</Button>
</Stack>
```

### Tables

```tsx
import {
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination
} from "@mui/material"
import { Text } from "@vivaahealth/design-system"

<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell><Text sx={{ fontWeight: 500 }}>Name</Text></TableCell>
      <TableCell><Text sx={{ fontWeight: 500 }}>Status</Text></TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell><Text>{row.name}</Text></TableCell>
        <TableCell><Tag color="success">{row.status}</Tag></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Dialogs

```tsx
import { Dialog, Icon } from "@vivaahealth/design-system"
import { Button } from "@mui/material"

<Dialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  Icon={<Icon.AlertTriangle color="#FFAE00" size="large" />}
>
  <Button variant="contained" fullWidth onClick={handleConfirm}>
    Confirm
  </Button>
  <Button variant="outlined" fullWidth onClick={() => setIsOpen(false)}>
    Cancel
  </Button>
</Dialog>
```

---

## Workarounds for Missing Components

### Agent Category Icons

The monorepo has custom SVG icons for each agent category. In this repo, use MUI icons with gradient backgrounds as approximations:

```tsx
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const categoryIcons = {
  rcm: <AttachMoneyIcon sx={{ fontSize: 16, color: "white" }} />,
  authorization: <VerifiedIcon sx={{ fontSize: 16, color: "white" }} />,
  // ... etc
}

const categoryColors = {
  rcm: { dark: "#1e40af", light: "#3b82f6" },
  authorization: { dark: "#7c3aed", light: "#a78bfa" },
  // ... etc
}

<Box sx={{
  width: 24,
  height: 24,
  background: `linear-gradient(to right, ${colors.dark}, ${colors.light})`,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}>
  {categoryIcons[category]}
</Box>
```

### Common Utilities

```tsx
// Simple local implementations
const isDefined = <T,>(value: T | null | undefined): value is T => 
  value !== null && value !== undefined

const isTruthy = (value: unknown): boolean => Boolean(value)
```

---

## Setup

### Prerequisites

1. **pnpm** - Install via `corepack enable pnpm` or `brew install pnpm`
2. **GitHub Packages authentication** - Required for `@vivaahealth/design-system`

### GitHub Packages Auth

```bash
npm login --registry=https://npm.pkg.github.com
# Username: your GitHub username
# Password: your personal access token (with read:packages scope)
# Email: your GitHub email
```

### Install & Run

```bash
pnpm install
pnpm dev
```

View at [http://localhost:3000](http://localhost:3000)

---

## Sidebar Navigation

The sidebar closely mirrors the monorepo's `web/staff/src/components/Navigation/` implementation:

### Features Matching Monorepo

| Feature | Implementation |
|---------|----------------|
| **Expand/Collapse** | Click the toggle button (top-right of header) to switch between fixed and collapsible modes |
| **Hover to Expand** | In collapsed mode, hover over sidebar to temporarily expand |
| **Accordion Sections** | Click section headers (Build, Analyze, etc.) to expand/collapse sub-links |
| **Active Link Highlighting** | Current page is highlighted with white background and left indicator |
| **Dark Theme** | Matches monorepo gradient: `#030A33` to `#00044B` |
| **Section Divider** | Divider separates main sections (Build-Manage) from secondary (Templates-Tools) |

### Key Files Referenced from Monorepo

- `Navigation/Drawer.tsx` → Main drawer wrapper with permanent + hover modes
- `Navigation/context.ts` → `SideNavigationMode` enum (Fixed, OverlayOnHover)
- `Navigation/Sections/lib/LinkAccordion.tsx` → Accordion expand/collapse
- `Navigation/Theme.tsx` → Dark theme overrides for MUI components
- `Navigation/constants.ts` → Width values (228px expanded, 52px collapsed)

### What's Different (Simplified)

- No search functionality (just UI placeholder)
- No routing integration (static `href` links)
- No localStorage persistence for expand/collapse state
- Simplified animation (CSS transitions vs. Spring animations)

---

## Project Structure

```
app/
  layout.tsx       # Root layout with design system + MUI providers
  page.tsx         # Main prototype page (Flows table)
  globals.css      # Global styles + Tailwind

components/
  layout/
    app-layout.tsx        # App shell (sidebar + main content)
    side-navigation.tsx   # Notable Flow Studio sidebar (monorepo-aligned)
  providers/
    mui-theme-provider.tsx  # MUI theme context

lib/
  mui-theme.ts     # MUI theme aligned with design system
```

---

## Resources

- **Design System Storybook**: https://design-systems.story.notablehealth-staging.com
- **MUI Documentation**: https://mui.com/material-ui/
- **Monorepo Design System**: `web/design-system/` in the vivaa repo
