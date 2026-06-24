# Cal.com Monorepo Dependency Analysis

> Generated: 2026-06-24
> Scope: `packages/*` inter-dependencies and `apps/web/` consumption

---

## Table of Contents

1. [Package Inventory](#1-package-inventory)
2. [Dependency Matrix](#2-dependency-matrix)
3. [Circular Dependencies](#3-circular-dependencies)
4. [Fan-Out Analysis](#4-fan-out-analysis-packages-importing-many-others)
5. [Fan-In Analysis](#5-fan-in-analysis-packages-imported-by-many-others)
6. [apps/web Dependency Profile](#6-appsweb-dependency-profile)
7. [Coupling Hotspots](#7-coupling-hotspots)
8. [Undeclared Dependencies](#8-undeclared-dependencies-source-imports-missing-from-packagejson)
9. [Architectural Observations](#9-architectural-observations)
10. [Prioritized Refactoring Recommendations](#10-prioritized-refactoring-recommendations)

---

## 1. Package Inventory

23 `@calcom/*` packages organized into four groups:

### Core Packages

| Package | Path | Role |
|---------|------|------|
| `@calcom/lib` | `packages/lib` | Shared utilities, hooks, helpers |
| `@calcom/prisma` | `packages/prisma` | Database schema, Prisma client |
| `@calcom/trpc` | `packages/trpc` | tRPC API routers |
| `@calcom/types` | `packages/types` | Shared TypeScript type definitions |
| `@calcom/config` | `packages/config` | Shared configuration (ESLint, Tailwind) |
| `@calcom/tsconfig` | `packages/tsconfig` | TypeScript config presets |
| `@calcom/dayjs` | `packages/dayjs` | Day.js wrapper with timezone plugins |
| `@calcom/debugging` | `packages/debugging` | Debug utilities |
| `@calcom/kysely` | `packages/kysely` | Kysely query builder integration |

### Feature Packages

| Package | Path | Role |
|---------|------|------|
| `@calcom/features` | `packages/features` | Feature-specific business logic and UI |
| `@calcom/app-store` | `packages/app-store` | Third-party integration apps |
| `@calcom/emails` | `packages/emails` | Email templates and sending logic |
| `@calcom/ui` | `packages/ui` | Shared UI component library |

### Embed Packages

| Package | Path | Role |
|---------|------|------|
| `@calcom/embed-core` | `packages/embeds/embed-core` | Core embed functionality |
| `@calcom/embed-react` | `packages/embeds/embed-react` | React embed wrapper |
| `@calcom/embed-snippet` | `packages/embeds/embed-snippet` | Embed snippet generator |

### Platform Packages

| Package | Path | Role |
|---------|------|------|
| `@calcom/atoms` | `packages/platform/atoms` | Platform UI atoms |
| `@calcom/platform-constants` | `packages/platform/constants` | Platform constants |
| `@calcom/platform-enums` | `packages/platform/enums` | Platform enumerations |
| `@calcom/platform-libraries` | `packages/platform/libraries` | Platform library wrappers |
| `@calcom/platform-types` | `packages/platform/types` | Platform type definitions |
| `@calcom/platform-utils` | `packages/platform/utils` | Platform utility functions |

---

## 2. Dependency Matrix

Source-level import counts between packages (rows import from columns). Only non-zero cells shown.

### Core/Feature Package Matrix

| Importer | prisma | lib | features | app-store | ui | trpc | types | dayjs | emails | embed-core | atoms | config | kysely | ee |
|----------|--------|-----|----------|-----------|----|----- |-------|-------|--------|------------|-------|--------|--------|-----|
| **features** | 1030 | 893 | - | 213 | 144 | 88 | 138 | 148 | 36 | 7 | 9 | 2 | 2 | 44 |
| **trpc** | 529 | 272 | 605 | 73 | 2 | - | 15 | 16 | 12 | - | - | 1 | 3 | 28 |
| **app-store** | 245 | 478 | 100 | - | 127 | - | 231 | 11 | 6 | - | 1 | - | - | - |
| **lib** | 69 | - | 3 | - | - | - | 27 | 28 | 2 | 4 | 1 | 2 | - | 2 |
| **emails** | 13 | 128 | 5 | 3 | - | - | 39 | 6 | - | - | - | - | - | - |
| **ui** | 3 | 47 | 3 | - | - | - | 4 | 1 | - | 1 | - | - | - | - |
| **types** | 12 | 2 | 1 | 2 | 1 | - | - | - | - | - | - | - | - | - |
| **prisma** | - | 2 | - | - | - | - | - | - | - | - | - | - | - | - |

### Platform Package Matrix

| Importer | features | lib | trpc | ui | prisma | app-store | types | emails | dayjs | embed-core | p-constants | p-types | p-enums | p-libraries | web |
|----------|----------|-----|------|----|--------|-----------|-------|--------|-------|------------|-------------|---------|---------|-------------|-----|
| **atoms** | 111 | 51 | 22 | 65 | 15 | 13 | 8 | - | 5 | 2 | 79 | 85 | - | 2 | 75 |
| **p-libraries** | 97 | 19 | 24 | - | 8 | 17 | 4 | 14 | - | - | - | - | - | - | - |
| **p-types** | - | - | - | - | - | - | - | - | - | - | 17 | - | 8 | - | - |
| **p-enums** | - | - | - | - | - | - | - | - | - | - | 1 | 1 | - | - | - |
| **p-utils** | - | - | - | - | - | - | - | - | - | - | 2 | 1 | - | - | - |

### apps/web Import Profile

| Dependency | Import Count |
|------------|-------------|
| `@calcom/ui` | 1936 |
| `@calcom/lib` | 1345 |
| `@calcom/features` | 1202 |
| `@calcom/trpc` | 516 |
| `@calcom/prisma` | 449 |
| `@calcom/app-store` | 190 |
| `@calcom/dayjs` | 99 |
| `@calcom/types` | 84 |
| `@calcom/atoms` | 43 |
| `@calcom/embed-core` | 19 |
| `@calcom/platform-constants` | 14 |
| `@calcom/platform-types` | 11 |
| `@calcom/ee` | 8 |
| `@calcom/feature-auth` | 6 |
| `@calcom/emails` | 6 |
| `@calcom/routing-forms` | 2 |
| `@calcom/config` | 1 |

---

## 3. Circular Dependencies

### 3.1 Direct Circular Dependencies (A <-> B)

17 bidirectional dependency pairs detected at the source-import level:

| Pair | A->B Imports | B->A Imports | Total | Severity |
|------|-------------|-------------|-------|----------|
| `features` <-> `lib` | 893 | 3 | 896 | **Critical** |
| `features` <-> `trpc` | 88 | 605 | 693 | **Critical** |
| `app-store` <-> `features` | 100 | 213 | 313 | **Critical** |
| `app-store` <-> `types` | 231 | 2 | 233 | High |
| `features` <-> `ui` | 144 | 3 | 147 | High |
| `features` <-> `types` | 138 | 1 | 139 | High |
| `emails` <-> `lib` | 128 | 2 | 130 | High |
| `atoms` <-> `features` | 111 | 9 | 120 | High |
| `lib` <-> `prisma` | 69 | 2 | 71 | Medium |
| `atoms` <-> `lib` | 51 | 1 | 52 | Medium |
| `emails` <-> `features` | 5 | 36 | 41 | Medium |
| `lib` <-> `types` | 27 | 2 | 29 | Medium |
| `app-store` <-> `atoms` | 1 | 13 | 14 | Low |
| `app-store` <-> `emails` | 6 | 3 | 9 | Low |
| `platform-enums` <-> `platform-types` | 1 | 8 | 9 | Low |
| `embed-core` <-> `lib` | 1 | 4 | 5 | Low |
| `types` <-> `ui` | 1 | 4 | 5 | Low |

### 3.2 Transitive Circular Chains

262 transitive cycles detected (length 3-5 hops). Key patterns:

**High-impact cycles:**

```
features -> trpc -> lib -> features          (core triangle)
features -> trpc -> app-store -> features    (API-integration cycle)
features -> trpc -> emails -> features       (notification cycle)
features -> app-store -> emails -> features  (integration-notification cycle)
lib -> types -> prisma -> lib                (data layer cycle)
lib -> types -> ui -> lib                    (utility-UI cycle)
```

**The `features-trpc-lib` triangle** is the most severe: `@calcom/trpc` has 605 imports from `@calcom/features` while `@calcom/features` has 88 imports from `@calcom/trpc`, with both depending heavily on `@calcom/lib` which also depends back on `@calcom/features` (3 imports).

---

## 4. Fan-Out Analysis (Packages Importing Many Others)

Fan-out measures how many distinct `@calcom/*` packages a given package imports from.

| Package | Fan-Out | Assessment |
|---------|---------|------------|
| `@calcom/features` | 14 | Excessive - imports from nearly every other package |
| `@calcom/atoms` | 12 | Excessive - heavy cross-cutting dependency |
| `@calcom/trpc` | 10 | Excessive - API layer coupled to too many concerns |
| `@calcom/app-store` | 8 | Excessive - integration layer reaching broadly |
| `@calcom/lib` | 8 | Excessive - utility package should be a leaf |
| `@calcom/platform-libraries` | 8 | Excessive - platform wrapper too coupled |
| `@calcom/emails` | 6 | High |
| `@calcom/ui` | 6 | High - UI should ideally only depend on lib/types/dayjs |
| `@calcom/types` | 5 | High - type definitions should be a leaf package |

**Leaf packages (0 fan-out):** `config`, `dayjs`, `debugging`, `kysely`, `platform-constants`, `tsconfig`

---

## 5. Fan-In Analysis (Packages Imported by Many Others)

Fan-in measures how many other packages depend on a given package.

| Package | Fan-In | Role |
|---------|--------|------|
| `@calcom/lib` | 10 | Core utility hub |
| `@calcom/prisma` | 10 | Core data layer |
| `@calcom/types` | 10 | Core type definitions |
| `@calcom/features` | 8 | Feature logic (high fan-in is problematic for a feature package) |
| `@calcom/dayjs` | 7 | Date utility |
| `@calcom/app-store` | 6 | Integration hub |
| `@calcom/embed-core` | 6 | Embed core |
| `@calcom/ui` | 5 | UI components |
| `@calcom/emails` | 5 | Email system |

High fan-in for `prisma`, `lib`, and `types` is expected for foundational packages. However, `@calcom/features` having fan-in of 8 suggests it is being used as a shared library rather than an isolated feature module.

---

## 6. apps/web Dependency Profile

`apps/web` depends on **16 `@calcom/*` packages** (14 declared, 2 devDependencies) with **117 total npm dependencies** and **44 devDependencies**.

### Heaviest Dependencies on apps/web

The web app's top imports by volume:

1. **`@calcom/ui`** (1,936 imports) - Expected; UI components are the primary building blocks
2. **`@calcom/lib`** (1,345 imports) - Expected; shared utilities
3. **`@calcom/features`** (1,202 imports) - Expected; feature modules
4. **`@calcom/trpc`** (516 imports) - Expected; API layer
5. **`@calcom/prisma`** (449 imports) - Concerning; app layer directly accessing DB schema

### Undeclared Dependencies in apps/web

6 packages are imported from source but not declared in `apps/web/package.json`:

| Package | Imports | Risk |
|---------|---------|------|
| `@calcom/atoms` | 43 | Phantom dependency - resolved via workspace hoisting |
| `@calcom/platform-constants` | 14 | Phantom dependency |
| `@calcom/ee` | 8 | Phantom dependency |
| `@calcom/feature-auth` | 6 | Phantom dependency |
| `@calcom/emails` | 6 | Phantom dependency |
| `@calcom/routing-forms` | 2 | Phantom dependency |

---

## 7. Coupling Hotspots

### 7.1 Critical Coupling: `features` <-> `trpc` (693 cross-imports)

This is the highest-traffic bidirectional dependency in the monorepo.

- `@calcom/trpc` -> `@calcom/features`: **605 imports** across 463 files
  - tRPC routers directly call feature services, repositories, and utilities
- `@calcom/features` -> `@calcom/trpc`: **88 imports** across 74 files
  - Feature components and tests import tRPC client hooks and routers

**Root cause:** The tRPC package acts as both API definition layer *and* orchestrator of business logic. Feature code also reaches back into tRPC for client-side data fetching hooks.

### 7.2 Critical Coupling: `features` <-> `lib` (896 cross-imports)

- `@calcom/features` -> `@calcom/lib`: **893 imports** (expected, lib is foundational)
- `@calcom/lib` -> `@calcom/features`: **3 imports** (problematic)
  - `packages/lib/test/builder.ts` - test utility
  - `packages/lib/server/repository/selectedCalendar.test.ts` - test

**Root cause:** Test files in `lib` import from `features`. These should be co-located with features or use a test-utils package.

### 7.3 Critical Coupling: `app-store` <-> `features` (313 cross-imports)

- `@calcom/features` -> `@calcom/app-store`: **213 imports**
  - Feature code deeply integrates with app-store types, utilities, and components
- `@calcom/app-store` -> `@calcom/features`: **100 imports**
  - App integrations import feature hooks, components, and services

**Root cause:** No shared interface contract between features and integrations. Both reach directly into each other's internals.

### 7.4 Problematic: Packages Importing from `apps/web`

Multiple packages import from `@calcom/web`, which is an anti-pattern (packages should never depend on the application layer):

| Package | Files Importing @calcom/web | Nature |
|---------|----------------------------|--------|
| `@calcom/atoms` | 30 | Production code: imports Shell, i18n translations, event-type modules |
| `@calcom/features` | 43 | Mostly test files: imports test fixtures and booking scenarios |
| `@calcom/app-store` | 7 | Imports web modules |
| `@calcom/embed-core` | 6 | References web routes/types |
| `@calcom/emails` | 2 | Imports from web |
| `@calcom/lib` | 1 | Single file import |

### 7.5 Problematic: `@calcom/types` Is Not a Leaf

`@calcom/types` imports from 5 other packages (`prisma`, `lib`, `app-store`, `features`, `ui`), defeating its purpose as a foundational type-definition package. Specific offenders:

- `packages/types/App.d.ts` -> `@calcom/app-store` (2 imports)
- `packages/types/Calendar.d.ts` -> `@calcom/features` (1 import)
- `packages/types/data-table.d.ts` -> `@calcom/ui` (1 import)

---

## 8. Undeclared Dependencies (Source Imports Missing from package.json)

Packages whose source code imports `@calcom/*` packages not listed in their `package.json`. These are "phantom dependencies" that work due to Yarn workspace hoisting but create fragile, implicit coupling.

### Critical (>100 undeclared imports)

| Package | Undeclared Dependency | Import Count |
|---------|----------------------|-------------|
| `@calcom/features` | `@calcom/prisma` | 1030 |
| `@calcom/trpc` | `@calcom/features` | 605 |
| `@calcom/trpc` | `@calcom/prisma` | 529 |
| `@calcom/trpc` | `@calcom/lib` | 272 |
| `@calcom/app-store` | `@calcom/prisma` | 245 |
| `@calcom/features` | `@calcom/app-store` | 213 |
| `@calcom/features` | `@calcom/web` | 142 |
| `@calcom/features` | `@calcom/types` | 138 |
| `@calcom/atoms` | `@calcom/features` | 111 |

### High (10-100 undeclared imports)

| Package | Undeclared Dependency | Import Count |
|---------|----------------------|-------------|
| `@calcom/atoms` | `@calcom/platform-types` | 85 |
| `@calcom/atoms` | `@calcom/platform-constants` | 79 |
| `@calcom/atoms` | `@calcom/web` | 75 |
| `@calcom/atoms` | `@calcom/ui` | 65 |
| `@calcom/atoms` | `@calcom/lib` | 51 |
| `@calcom/trpc` | `@calcom/app-store` | 73 |
| `@calcom/features` | `@calcom/ee` | 44 |
| `@calcom/features` | `@calcom/emails` | 36 |
| `@calcom/trpc` | `@calcom/ee` | 28 |
| `@calcom/platform-libraries` | `@calcom/trpc` | 24 |
| `@calcom/atoms` | `@calcom/trpc` | 22 |
| `@calcom/platform-libraries` | `@calcom/app-store` | 17 |
| `@calcom/atoms` | `@calcom/prisma` | 15 |
| `@calcom/platform-libraries` | `@calcom/emails` | 14 |
| `@calcom/emails` | `@calcom/prisma` | 13 |
| `@calcom/atoms` | `@calcom/app-store` | 13 |
| `@calcom/trpc` | `@calcom/emails` | 12 |

---

## 9. Architectural Observations

### 9.1 Layer Violations

The intended dependency direction is:

```
apps/web -> features, trpc, ui -> lib, types, prisma -> config, tsconfig, dayjs
```

Observed violations:
- **Upward dependencies:** `features` -> `trpc` (88), `lib` -> `features` (3), `ui` -> `features` (3), `types` -> `app-store` (2), `types` -> `features` (1)
- **Cross-app:** Multiple packages import from `@calcom/web` (total ~90 files)
- **Circular foundation:** `lib` <-> `prisma` creates a cycle at the base layer

### 9.2 The `@calcom/features` Problem

`@calcom/features` is the largest and most entangled package:
- **971 source files** with cross-package imports
- **Fan-out of 14** (imports from nearly every package)
- **Fan-in of 8** (depended upon by 8 other packages)
- **1,030 undeclared imports** from `@calcom/prisma`
- Contains business logic, UI components, services, repositories, and test utilities

It effectively functions as a second `lib` package with no clear domain boundaries internally.

### 9.3 The `@calcom/atoms` Problem

`@calcom/atoms` declares zero `@calcom/*` dependencies in package.json but has source-level imports from **13 different `@calcom/*` packages**. It also imports from `apps/web` (75 imports), creating a package-to-app dependency. Every single dependency is a phantom dependency.

### 9.4 The `@calcom/trpc` Problem

`@calcom/trpc` declares zero `@calcom/*` dependencies but imports from **12 packages** at the source level (605 from features, 529 from prisma, 272 from lib). This package has the second-highest fan-out and contributes to the most critical circular dependency cycle.

---

## 10. Prioritized Refactoring Recommendations

### Priority 1: Declare All Dependencies (Effort: Low, Impact: High)

**Problem:** Most packages rely on Yarn workspace hoisting for resolution, making the dependency graph invisible to tooling.

**Action:** For each package, add all source-imported `@calcom/*` packages to the `dependencies` or `devDependencies` field in `package.json`. Focus first on:
1. `@calcom/trpc` - add `@calcom/features`, `@calcom/prisma`, `@calcom/lib`, etc.
2. `@calcom/features` - add `@calcom/prisma`, `@calcom/app-store`, `@calcom/types`, etc.
3. `@calcom/atoms` - add all 13 undeclared dependencies

This enables tools like Turborepo to correctly order builds and detect issues.

### Priority 2: Break the `features` <-> `trpc` Cycle (Effort: High, Impact: Critical)

**Problem:** 693 cross-imports create a tightly coupled core that makes independent development impossible.

**Approach:**
- Extract shared interfaces/types into a new `@calcom/trpc-types` or expand `@calcom/types` to hold tRPC-related type contracts
- Move tRPC client hooks (used by feature components) into `@calcom/features` or a new `@calcom/trpc-client` package
- Keep `@calcom/trpc` as a pure server-side API definition that calls into `@calcom/features` (one-way dependency)
- Result: `trpc -> features -> lib` (unidirectional)

### Priority 3: Make `@calcom/types` a True Leaf Package (Effort: Low, Impact: Medium)

**Problem:** `types` imports from `prisma`, `lib`, `app-store`, `features`, and `ui`, creating cycles with packages that depend on it.

**Action:**
- Move `App.d.ts` app-store imports to `@calcom/app-store/types`
- Move `Calendar.d.ts` features import to `@calcom/features/types`
- Move `data-table.d.ts` ui import to `@calcom/ui/types`
- Move Prisma-dependent types to `@calcom/prisma/types` or use `import type` with isolated declaration files
- `@calcom/types` should only export pure TypeScript types with zero runtime dependencies

### Priority 4: Eliminate `@calcom/web` Imports from Packages (Effort: Medium, Impact: High)

**Problem:** ~90 files across packages import from the app layer, inverting the dependency hierarchy.

**Approach:**
- **Test fixtures** (features, emails): Extract `apps/web/test/utils/bookingScenario/` into `@calcom/test-utils` package
- **i18n translations** (atoms): Create `@calcom/i18n` package or use a translation loader that doesn't couple to web
- **Shell/Layout components** (atoms): Extract shared Shell components into `@calcom/ui` or `@calcom/ui/shell`
- **Event-type modules** (atoms): Extract shared event-type components into `@calcom/features/event-types`

### Priority 5: Break `@calcom/lib` Upward Dependencies (Effort: Low, Impact: Medium)

**Problem:** `@calcom/lib` imports from `features` (3), `emails` (2), `atoms` (1), and `embed-core` (4), creating cycles.

**Action:**
- Move `lib/test/builder.ts` to `@calcom/test-utils` or co-locate with features tests
- Move `lib/hooks/useLocale.ts` atom import to a shared hook location in atoms or remove the dependency
- Move embed-related utilities (`sdk-event.ts`, `browser.utils.ts`, `useTheme.ts`, `getBrandColours.tsx`) out of lib into embed-core or a new `@calcom/embed-utils`

### Priority 6: Decompose `@calcom/features` (Effort: Very High, Impact: Critical, Long-term)

**Problem:** `@calcom/features` is a 971-file mega-package with 14 fan-out and 8 fan-in. It contains booking logic, calendar integration, organization management, workflows, routing forms, and more.

**Approach (incremental):**
1. Identify natural domain boundaries within features (bookings, organizations, workflows, routing-forms)
2. Extract each domain into its own package: `@calcom/feature-bookings`, `@calcom/feature-orgs`, etc.
3. Each feature package should depend downward only (on `lib`, `prisma`, `types`)
4. Shared feature utilities stay in a reduced `@calcom/features/shared`

### Priority 7: Clean Up `@calcom/ui` Dependencies (Effort: Low, Impact: Medium)

**Problem:** `@calcom/ui` imports from `@calcom/features` (3 files), `@calcom/prisma` (3), and `@calcom/embed-core` (1). UI components should only depend on `lib`, `types`, and `dayjs`.

**Action:**
- `UserAvatarGroup.tsx`, `UserAvatarGroupWithOrg.tsx`, `CalendarSwitch.tsx` - move feature-dependent components to `@calcom/features` or accept feature types via props/generics
- Remove direct Prisma imports - pass data via props instead of querying the database from UI components

### Priority 8: Resolve `@calcom/atoms` Phantom Dependencies (Effort: Medium, Impact: Medium)

**Problem:** `@calcom/atoms` has 0 declared `@calcom/*` dependencies but imports from 13 packages including `apps/web`.

**Action:**
1. Declare all actual dependencies in `package.json`
2. Replace `@calcom/web` imports with properly extracted packages (see Priority 4)
3. Consider whether `atoms` should be a thin wrapper or fully self-contained

---

## Appendix: Ideal Dependency Direction

```
                        apps/web
                       /    |    \
                      /     |     \
                  trpc  features  ui      <-- Application layer
                    |   /  |  \    |
                    |  /   |   \   |
                 app-store |  emails      <-- Domain layer
                      \    |    /
                       \   |   /
                     lib  types           <-- Foundation layer
                      |    |
                      |    |
                    prisma dayjs          <-- Infrastructure layer
                      |
                    config, tsconfig      <-- Configuration layer
```

Arrows point downward only; no upward or lateral dependencies between layers.
