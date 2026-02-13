# Turborepo Configuration Guide

This document explains the `turbo.json` configuration that orchestrates builds, development, testing, and linting across the Cal.com monorepo.

## Overview

[Turborepo](https://turbo.build/) is the build system used to manage task dependencies, caching, and parallel execution across all packages and applications in the monorepo. The configuration in `turbo.json` defines how tasks relate to each other and what can be cached.

## Structure

### Global Dependencies

```json
"globalDependencies": ["yarn.lock"]
```

Any change to `yarn.lock` invalidates all caches, forcing a full rebuild when dependencies change.

### Global Environment Variables

The `globalEnv` array lists 300+ environment variables that affect build output. Turborepo uses these to compute cache keys — if any listed variable changes between runs, caches are invalidated. Variables are grouped by:

- **Database**: `DATABASE_URL`, `DATABASE_DIRECT_URL`, `INSIGHTS_DATABASE_URL`
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_COOKIE_DOMAIN`
- **Integrations**: `GOOGLE_API_CREDENTIALS`, `ZOOM_CLIENT_ID`, `STRIPE_PRIVATE_KEY`, etc.
- **Public client vars**: `NEXT_PUBLIC_WEBAPP_URL`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, etc.
- **Embed**: `EMBED_PUBLIC_*` variables for embed build configuration
- **E2E testing**: `E2E_TEST_*`, `PLAYWRIGHT_*` variables

## Task Definitions

### Build Pipeline

#### `build` (generic)
```json
"build": {
  "dependsOn": ["^build"],
  "outputs": ["dist/**", ".next/**"]
}
```
Default build task. `^build` means "build all workspace dependencies first" (topological ordering). Outputs are cached.

#### `@calcom/prisma#build`
```json
"@calcom/prisma#build": {
  "cache": false,
  "dependsOn": ["post-install"]
}
```
Prisma client generation is never cached because it depends on the database state and schema. Must run after `post-install` (which runs `prisma generate`).

#### `@calcom/trpc#build`
```json
"@calcom/trpc#build": {
  "dependsOn": ["@calcom/prisma#post-install"],
  "outputs": ["./types"]
}
```
Generates tRPC type definitions. Depends on Prisma types being available first.

#### `@calcom/web#build`
```json
"@calcom/web#build": {
  "dependsOn": ["^build", "copy-app-store-static"],
  "outputs": [".next/**"],
  "env": [...]
}
```
Main web app build. Depends on all package builds (`^build`) and static app-store assets. Has its own `env` list for Next.js build-time variables (Sentry, Stripe, etc.).

#### `@calcom/api-v2#build`
```json
"@calcom/api-v2#build": {
  "dependsOn": ["^build"],
  "env": ["NODE_ENV", "API_PORT", "DATABASE_READ_URL", ...]
}
```
NestJS API build. Depends on all workspace dependencies being built first.

#### `@calcom/embed-core#build`
```json
"@calcom/embed-core#build": {
  "cache": false,
  "outputs": ["../../../apps/web/public/embed/**"],
  "env": ["EMBED_PUBLIC_*"]
}
```
Embed core build outputs directly into the web app's `public/embed/` directory. Never cached because embed versioning needs to be fresh.

### Development Tasks

#### `dev` (generic)
```json
"dev": {
  "dependsOn": ["//#env-check:common", "//#env-check:app-store"],
  "cache": false
}
```
Development server. Never cached. Depends on environment variable validation running first (`//#` prefix means root-level task).

#### `@calcom/web#dev`
```json
"@calcom/web#dev": {
  "dependsOn": ["@calcom/trpc#build", "//#env-check:common", "//#env-check:app-store"],
  "cache": false
}
```
Web app dev server. Requires tRPC types to be generated first for type-safe development.

### Database Tasks

All database tasks have `cache: false` since they involve side effects:

| Task | Depends On | Purpose |
|---|---|---|
| `@calcom/prisma#db-up` | — | Start local PostgreSQL (Docker) |
| `@calcom/prisma#db-migrate` | `db-up` | Run development migrations |
| `@calcom/prisma#db-seed` | `db-deploy` | Seed test data |
| `@calcom/prisma#db-reset` | — | Drop + recreate + migrate + seed |
| `@calcom/prisma#dx` | `db-up` | Full dev setup (migrate + seed) |

### Quality Tasks

#### `lint`
```json
"lint": {
  "dependsOn": ["^lint"]
}
```
Runs Biome linting. Topological dependency ensures packages are linted bottom-up.

#### `type-check`
```json
"type-check": {
  "cache": false,
  "dependsOn": ["@calcom/trpc#build"]
}
```
TypeScript type checking. Requires tRPC types to be generated. Never cached to ensure fresh checks.

### Special Tasks

#### `@calcom/web#copy-app-store-static`
```json
"@calcom/web#copy-app-store-static": {
  "inputs": ["../../packages/app-store/**/static/**/*"],
  "outputs": ["public/app-store/**"]
}
```
Copies static assets (icons, images) from app-store packages into the web app's public directory.

#### Environment Checks
```json
"//#env-check:common": {
  "inputs": ["./.env.example", "./.env"],
  "outputs": ["./.env"]
}
```
Root-level tasks that validate `.env` files exist and match the example templates.

## Task Dependency Graph (Simplified)

```
env-check:common ──┐
env-check:app-store─┤
                    ▼
              @calcom/web#dev
                    │
                    ▼
            @calcom/trpc#build
                    │
                    ▼
          @calcom/prisma#post-install
                    │
                    ▼
            prisma generate
```

For production builds:
```
@calcom/prisma#build
        │
        ▼
@calcom/trpc#build ──────────┐
        │                     │
        ▼                     ▼
copy-app-store-static   @calcom/api-v2#build
        │
        ▼
@calcom/web#build
```

## Caching Behavior

- **Cached by default**: `build`, `lint`, `lint:report`, `start`, `post-install`
- **Never cached**: `dev`, `dx`, `db-*`, `type-check`, `embed-core#build`, `prisma#build`, `lint:fix`
- **Cache keys**: Computed from task inputs, outputs, env vars, and `globalDependencies`
- **Remote caching**: Can be enabled via Vercel for shared CI caches
