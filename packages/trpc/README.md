# @calcom/trpc

Type-safe API layer for internal communication between the Cal.com web app and its server-side business logic. Built on [tRPC](https://trpc.io/), this package defines all routers, procedures, middleware, and context creation used by the web application.

## Architecture Overview

### How tRPC Connects the Web App to Business Logic

```
Browser (React)                    Server (Next.js API route)
─────────────────                  ──────────────────────────
trpc.useQuery()  ──HTTP POST──>    pages/api/trpc/[trpc].ts
trpc.useMutation()                        │
  (@calcom/trpc/react)                    ▼
                                  createNextApiHandler(appRouter)
                                          │
                                          ▼
                                  createContext() ── builds session, locale, prisma
                                          │
                                          ▼
                                  appRouter.viewer.bookings.get()
                                  (packages/trpc/server/routers/viewer/bookings/)
                                          │
                                          ▼
                                  @calcom/features + @calcom/prisma
```

### Directory Structure

```
packages/trpc/
├── index.ts                      # Package entrypoint (now empty — use subpath imports)
├── react/                        # Client-side tRPC hooks for React
│   ├── trpc.ts                   # tRPC React client configuration (httpBatchLink, superjson)
│   ├── index.ts                  # Re-exports trpc client and hooks
│   ├── shared.ts                 # Shared client utilities
│   └── hooks/                    # Custom React hooks built on tRPC
├── server/                       # Server-side router definitions
│   ├── trpc.ts                   # tRPC initialization (router, middleware, procedure factories)
│   ├── createContext.ts          # Context creation (session, prisma, locale, IP, tracing)
│   ├── createNextApiHandler.ts   # Next.js API route adapter with caching rules
│   ├── errorFormatter.ts         # Custom error formatting for tRPC responses
│   ├── onErrorHandler.ts         # Global error handler (logging, Sentry)
│   ├── procedures/               # Reusable procedure builders (authed, public, admin)
│   ├── middlewares/               # tRPC middlewares (auth checks, rate limiting, logging)
│   ├── routers/                  # All route definitions
│   │   ├── _app.ts              # Root router: { viewer: viewerRouter }
│   │   ├── viewer/              # Authenticated user routes
│   │   │   ├── _router.tsx      # Viewer router composition (40+ sub-routers)
│   │   │   ├── bookings/        # Booking CRUD procedures
│   │   │   ├── eventTypes/      # Event type management
│   │   │   ├── slots/           # Availability slot queries
│   │   │   ├── availability/    # Schedule management
│   │   │   ├── teams/           # Team operations
│   │   │   ├── organizations/   # Organization management
│   │   │   ├── workflows/       # Automation workflows
│   │   │   └── ...              # 30+ more domain routers
│   │   ├── publicViewer/        # Public (unauthenticated) routes
│   │   ├── loggedInViewer/      # Logged-in-only viewer routes
│   │   └── apps/               # App-specific routes (routing-forms)
│   ├── adapters/                # Server-side adapters
│   └── lib/                     # Server-side utilities
└── types/                       # Shared TypeScript type definitions
```

### Key Files

#### `server/trpc.ts` - tRPC Initialization
Creates the core tRPC instance with:
- **superjson** transformer for automatic Date/Map/Set serialization
- **Custom error formatter** for consistent error responses
- Exports `router`, `middleware`, `procedure`, `mergeRouters`, and `createCallerFactory`

#### `server/routers/_app.ts` - Root Router
Defines the application's root router with a single `viewer` namespace. The `appRouter` type is exported as `AppRouter` and used by the React client for end-to-end type inference.

#### `server/routers/viewer/_router.tsx` - Viewer Router
Composes 40+ sub-routers covering every domain in the application:
- Core: `bookings`, `eventTypes`, `slots`, `availability`, `calendars`, `me`
- Teams: `teams`, `organizations`
- Integrations: `apps`, `credentials`, `calVideo`, `googleWorkspace`
- Admin: `admin`, `users`, `dsync`, `sso`
- Features: `workflows`, `webhooks`, `insights`, `payments`, `routingForms`

#### `server/createContext.ts` - Context Creation
Builds the context available to every procedure:
- **Inner context** (always available): `prisma`, `insightsDb` (read replica), `locale`, `session`, `sourceIp`, `traceContext`
- **Outer context** (HTTP requests): adds `req` and `res` from Next.js
- Used for testing by calling `createContextInner()` directly without HTTP request/response

#### `server/createNextApiHandler.ts` - API Route Adapter
Wraps tRPC's Next.js adapter with Cal.com-specific configuration:
- **Query batching** enabled for efficient multi-query requests
- **Response caching** rules per procedure path (e.g., `i18n.get` cached by version, `slots.getSchedule` never cached)
- **CDN cache headers** (cdn-cache-control) for Vercel edge caching

### Procedure Types

Procedures are the individual API endpoints. They use middleware to enforce access control:
- **`publicProcedure`** - No authentication required (slot queries, i18n, feature flags)
- **`authedProcedure`** - Requires a valid session (most operations)
- **`adminProcedure`** - Requires admin role

### Connection to Monorepo

| Package | Role |
|---|---|
| `@calcom/prisma` | Database access injected into context (`ctx.prisma`) |
| `@calcom/features` | Business logic called by procedure handlers |
| `@calcom/lib` | Shared utilities (getIP, tracing, constants) |
| `apps/web` | Consumes routers via `@calcom/trpc/react` hooks and serves the API handler |

### Usage

**Client-side (React):**
```typescript
import { trpc } from "@calcom/trpc/react";

const { data } = trpc.viewer.bookings.get.useQuery({ status: "upcoming" });
const mutation = trpc.viewer.eventTypes.create.useMutation();
```

**Server-side (API route):**
```typescript
import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { appRouter } from "@calcom/trpc/server/routers/_app";

export default createNextApiHandler(appRouter);
```

**Server-side caller (e.g., getServerSideProps):**
```typescript
import { createCallerFactory } from "@calcom/trpc/server/trpc";
import { appRouter } from "@calcom/trpc/server/routers/_app";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller(context);
const bookings = await caller.viewer.bookings.get({ status: "upcoming" });
```
