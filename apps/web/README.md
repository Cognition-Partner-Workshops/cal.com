# @calcom/web

Primary Next.js web application for Cal.com. This is the main user-facing app that serves the scheduling UI, booking pages, authentication flows, and admin dashboards.

## Architecture

### Runtime Stack

- **Next.js** (Pages Router + App Router hybrid) for SSR and routing
- **tRPC** (`@calcom/trpc`) for type-safe client-server communication
- **NextAuth** for session-based authentication
- **Tailwind CSS** for styling
- **React Hook Form** for form state management
- **Zustand** for client-side state (e.g., BookerStore)

### Directory Structure

```
apps/web/
├── pages/               # Next.js Pages Router entrypoints
│   ├── _app.tsx         # Root app wrapper (SessionProvider, tRPC, i18n)
│   ├── _document.tsx    # Custom HTML document
│   ├── api/             # Next.js API routes (tRPC handler, auth, webhooks)
│   └── router/          # Routing helper pages
├── modules/             # Feature-based view modules
│   ├── bookings/        # Booking list and detail views
│   ├── event-types/     # Event type listing and editing views
│   ├── availability/    # Schedule management views
│   ├── auth/            # Login, signup, password reset
│   ├── settings/        # User/team/org settings pages
│   ├── embed/           # Embed preview and configuration
│   ├── getting-started/ # Onboarding wizard
│   └── ...              # Other feature modules
├── components/          # Reusable React components specific to web
├── lib/                 # Web-specific utilities and helpers
├── server/              # Server-side utilities
├── next.config.ts       # Next.js configuration (rewrites, redirects, headers)
├── middleware.ts         # Edge middleware for routing and org domain handling
└── package.json         # Package definition (@calcom/web)
```

### Key Entrypoints

#### `pages/_app.tsx`
Root application wrapper that bootstraps all global providers:
- **SessionProvider** (NextAuth) for authentication state
- **WebPushProvider** for browser push notifications
- **CacheProvider** for SVG caching
- **tRPC** wrapping via `trpc.withTRPC()` to enable type-safe API calls
- Resolves locale on the server via `getInitialProps` for i18n

#### `next.config.ts`
Central configuration controlling routing, security, and build behavior:
- **Environment validation**: Fails build if required secrets (NEXTAUTH_SECRET, CALENDSO_ENCRYPTION_KEY) are missing
- **Rewrites**: Maps `/login` to `/auth/login`, `/forms/` to routing-forms, locale stripping, organization subdomain rewrites, and proxy routes for API v2
- **Redirects**: Normalizes legacy paths (e.g., `/settings` to `/settings/my-account/profile`)
- **Headers**: Sets security headers (X-Frame-Options, CSP, CORS for embeds)
- **Transpile packages**: Ensures monorepo packages (`@calcom/trpc`, `@calcom/features`, etc.) are bundled correctly

#### `pages/api/`
Next.js API routes that serve as the server-side backend:
- `pages/api/trpc/[trpc].ts` handles all tRPC procedure calls
- Auth endpoints via NextAuth (`pages/api/auth/[...nextauth].ts`)
- Webhook receivers, cron jobs, and integration callbacks

### Connection to Monorepo Packages

| Package | How It Connects |
|---|---|
| `@calcom/trpc` | Web app calls tRPC procedures via `trpc.useQuery()` / `trpc.useMutation()` from `@calcom/trpc/react`. The tRPC API handler in `pages/api/trpc/` uses `createNextApiHandler` from `@calcom/trpc/server`. |
| `@calcom/features` | View modules import business logic components (Booker, Shell, event type forms, schedule editors) directly from `@calcom/features`. |
| `@calcom/prisma` | Not imported directly in client code. Accessed through tRPC procedures on the server side. |
| `@calcom/ui` | All shared UI primitives (Button, Dialog, Form, Table, etc.) come from `@calcom/ui`. |
| `@calcom/embeds` | The embed preview page and `embed.js` script are served from this app. `next.config.ts` rewrites `/embed.js` to the built embed bundle. |

### Development

```bash
# Start development server (port 3000)
yarn workspace @calcom/web dev

# Production build
yarn workspace @calcom/web build

# Run unit tests
yarn workspace @calcom/web test
```

### Patterns and Conventions

- **Module-based views**: Feature UIs live in `modules/` rather than `pages/`. Page files in `pages/` are thin wrappers that import from `modules/`.
- **PageWrapper pattern**: Components can define a `Component.PageWrapper` static property for layout wrapping.
- **Server-side locale**: Locale is resolved on the server in `_app.getInitialProps` and passed to the client for i18n.
- **Organization rewrites**: When `ORGANIZATIONS_ENABLED=1`, subdomain-based routing maps org domains to `/org/:slug/` paths via Next.js rewrites.
