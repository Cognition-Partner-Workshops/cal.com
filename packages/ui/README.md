# @calcom/ui

Shared React component library for Cal.com. Provides all UI primitives (buttons, dialogs, forms, tables, etc.) used across the web app, feature components, and platform atoms.

## Architecture Overview

### Design System

- **Tailwind CSS** with custom Cal.com theme tokens (brand colors, semantic colors)
- **Radix UI** primitives for accessible, unstyled base components (Dialog, Popover, Select, Checkbox)
- **class-variance-authority (CVA)** for type-safe component variant management
- **Lexical** for rich text editing
- **@tanstack/react-table** for data tables
- **react-hook-form** integration for form components
- **Lucide** icons with custom SVG sprite generation

### Directory Structure

```
packages/ui/
├── components/               # All UI components organized by category
│   ├── button/              # Button, ButtonGroup (CVA variants: primary, secondary, minimal, destructive)
│   ├── dialog/              # Dialog, ConfirmationDialog (Radix-based modals)
│   ├── form/                # Input, Select, TextArea, Switch, Checkbox, DatePicker, TimezoneSelect
│   ├── dropdown/            # DropdownMenu with items, separators, labels
│   ├── table/               # Table components (wraps @tanstack/react-table)
│   ├── avatar/              # Avatar, AvatarGroup with fallback initials
│   ├── badge/               # Badge with color variants for status display
│   ├── toast/               # Toast notifications (wraps Sonner)
│   ├── tooltip/             # Tooltip component
│   ├── skeleton/            # Loading skeleton components
│   ├── editor/              # Rich text editor (Lexical-based)
│   ├── icon/                # Icon component using SVG sprite
│   ├── card/                # Card layout component
│   ├── sheet/               # Side panel (drawer) component
│   ├── command/             # Command palette (cmdk-based)
│   ├── navigation/          # Navigation items and menus
│   ├── popover/             # Popover component (Radix-based)
│   ├── layout/              # Layout utilities
│   ├── empty-screen/        # Empty state illustrations
│   ├── breadcrumb/          # Breadcrumb navigation
│   ├── pagination/          # Pagination controls
│   ├── top-banner/          # Top-of-page announcement banner
│   ├── data-table/          # Enhanced data table with sorting/filtering
│   └── ...                  # 40+ more component categories
├── classNames.ts            # Utility for merging Tailwind classes (tailwind-merge)
├── styles/                  # Global CSS and Tailwind configuration
├── scripts/                 # Build scripts (icon sprite generation)
└── package.json             # @calcom/ui (exports each component category)
```

### Component Export Pattern

Components are exported via package.json `exports` map, enabling tree-shaking:

```typescript
// Import specific components (recommended)
import { Button } from "@calcom/ui/components/button";
import { Dialog } from "@calcom/ui/components/dialog";
import { Input } from "@calcom/ui/components/form";

// Import classNames utility
import classNames from "@calcom/ui/classNames";
```

Each component directory has an `index.ts` barrel export. The Next.js config in `apps/web` uses `optimizePackageImports: ["@calcom/ui"]` to ensure proper tree-shaking.

### Button Variant System

The Button component demonstrates the CVA variant pattern used throughout the library:

- **Variants**: `button` (default), `icon` (square), `fab` (floating action)
- **Colors**: `primary`, `secondary`, `minimal`, `destructive`
- **Sizes**: `xs`, `sm`, `base`, `lg`
- **States**: `loading` (spinner overlay), `disabled`

### Connection to Monorepo

| Consumer | How It Uses @calcom/ui |
|---|---|
| `apps/web` | All page-level UI components import from @calcom/ui |
| `@calcom/features` | Feature components compose UI primitives |
| `@calcom/embeds/embed-react` | Embed components use UI elements |
| `@calcom/platform/atoms` | Platform atoms wrap UI components |

### Development

```bash
# Build icon sprites
yarn workspace @calcom/ui build:icons

# Type check
yarn workspace @calcom/ui type-check

# Lint
yarn workspace @calcom/ui lint
```

### Conventions

- All components use Tailwind CSS classes with Cal.com theme tokens
- Accessible by default via Radix UI primitives
- Form components integrate with react-hook-form's Controller/Register patterns
- Colors use semantic tokens (`text-default`, `bg-subtle`, `border-emphasis`) rather than raw color values
- Icon names are typed via the generated `IconName` type from the Lucide sprite
