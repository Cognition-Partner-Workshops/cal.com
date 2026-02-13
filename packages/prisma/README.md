# @calcom/prisma

Database layer for Cal.com. This package owns the Prisma schema, migrations, client initialization, and shared database utilities used by every application and package in the monorepo.

## Architecture Overview

### What This Package Provides

1. **Prisma Schema** (`schema.prisma`) - The single source of truth for the database structure
2. **Generated Client** - Type-safe database client auto-generated from the schema
3. **Migrations** - SQL migration files for evolving the database schema
4. **Client Initialization** (`index.ts`) - Configured PrismaClient with extensions and connection pooling
5. **Zod Schemas** (`zod/`, `zod-utils.ts`) - Runtime validation schemas auto-generated from Prisma models
6. **Seed Scripts** (`seed.ts`) - Database seeding for development and testing

### Directory Structure

```
packages/prisma/
├── schema.prisma          # Database schema (models, enums, relations, generators)
├── index.ts               # PrismaClient initialization with extensions and pooling
├── migrations/            # SQL migration files (managed by Prisma Migrate)
├── generated/             # Auto-generated Prisma client (do not edit)
│   └── prisma/client/     # Generated TypeScript types and query engine
├── zod/                   # Auto-generated Zod schemas (one file per model)
├── zod-utils.ts           # Hand-written Zod schemas for complex JSON fields
├── selects/               # Reusable Prisma select objects for common queries
├── extensions/            # Prisma client extensions
│   ├── booking-idempotency-key.ts    # Ensures booking idempotency
│   ├── disallow-undefined-delete-update-many.ts  # Safety guard against mass operations
│   ├── exclude-locked-users.ts       # Filters locked users from queries
│   └── exclude-pending-payment-teams.ts  # Filters pending-payment teams
├── enums/                 # Generated TypeScript enum files
├── kysely/                # Generated Kysely type definitions (for raw SQL)
├── sql/                   # Raw SQL utilities
├── seed.ts                # Development database seeder
├── seed-pbac-only.ts      # PBAC (permissions) seeder
├── docker-compose.yml     # Local PostgreSQL for development
└── package.json           # @calcom/prisma
```

### Schema Generators

The schema configures four generators:

| Generator | Output | Purpose |
|---|---|---|
| `prisma-client` | `generated/prisma/client` | Type-safe database client with CJS module format |
| `zod-prisma-types` | `zod/` | Zod validation schemas per model (multi-file) |
| `prisma-kysely` | `kysely/types.ts` | Kysely type definitions for type-safe raw SQL |
| `enum-generator` | `enums/` | TypeScript enum files from Prisma enums |

### Core Models

The schema defines 80+ models. The most important ones for the scheduling domain:

| Model | Purpose |
|---|---|
| `User` | User accounts with authentication, profiles, and preferences |
| `Team` | Teams and organizations (when `isOrganization: true`) |
| `EventType` | Scheduling configurations (duration, locations, booking rules) |
| `Booking` | Scheduled meetings with status lifecycle |
| `Schedule` | Weekly availability rules with time ranges |
| `Availability` | Day-of-week + time range entries within a Schedule |
| `Credential` | Encrypted OAuth credentials for integrations |
| `Host` | Links users to team event types with priority/weight |
| `Webhook` | Event notification subscriptions |
| `Workflow` | Automated email/SMS triggered by booking events |
| `App` | Integration definitions in the app store |
| `Membership` | User-team relationships with roles |

### Client Initialization (`index.ts`)

The `prisma` export is a singleton PrismaClient with four extensions:

1. **excludeLockedUsersExtension** - Automatically filters locked users from queries
2. **excludePendingPaymentsExtension** - Filters teams with pending payments
3. **bookingIdempotencyKeyExtension** - Ensures booking creation idempotency
4. **disallowUndefinedDeleteUpdateManyExtension** - Safety guard preventing accidental mass deletions/updates when filter is undefined

Connection pooling is configured via `USE_POOL` env var. When enabled, uses `pg.Pool` with 5 max connections and 5-minute idle timeout. Otherwise, uses a direct connection.

A separate `readonlyPrisma` instance connects to `INSIGHTS_DATABASE_URL` for read-heavy analytics queries, falling back to the primary `prisma` instance if not configured.

### Connection to Monorepo

| Consumer | How It Uses @calcom/prisma |
|---|---|
| `@calcom/trpc` | Injected into tRPC context (`ctx.prisma`) for all procedure handlers |
| `@calcom/features` | Direct import for business logic (bookings, event types, schedules) |
| `apps/api/v2` | Wrapped in NestJS `PrismaModule` for dependency injection |
| `apps/api/v1` | Direct import in API route handlers |
| `apps/web` | Server-side only (via tRPC procedures, never in client bundles) |

### Development Commands

```bash
# Start local PostgreSQL (Docker)
yarn workspace @calcom/prisma db-up

# Run migrations (development - creates migration files)
yarn workspace @calcom/prisma db-migrate

# Apply migrations (production - no new files)
yarn workspace @calcom/prisma db-deploy

# Seed the database with test data
yarn workspace @calcom/prisma db-seed

# Reset database (drop + recreate + migrate + seed)
yarn workspace @calcom/prisma db-reset

# Generate Prisma client after schema changes
yarn workspace @calcom/prisma build
```

### Patterns and Conventions

- **JSON fields with Zod**: Complex JSON columns (e.g., `EventType.metadata`, `EventType.bookingFields`, `EventType.locations`) have hand-written Zod schemas in `zod-utils.ts` for runtime validation.
- **Soft-delete via extensions**: Rather than deleting records, some models use extensions to filter out "soft-deleted" entries (locked users, pending-payment teams).
- **Select objects**: Common field selections are defined in `selects/` to ensure consistent query shapes and avoid over-fetching.
- **Enum synchronization**: Prisma enums are auto-exported as TypeScript enums via the `enum-generator` for use in non-Prisma contexts.
