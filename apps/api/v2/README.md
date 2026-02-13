# @calcom/api-v2

Modern REST API for the Cal.com Platform, built with [NestJS](https://github.com/nestjs/nest). This is the primary API for external developers and platform partners building scheduling integrations on top of Cal.com.

## Architecture Overview

### Runtime Stack

- **NestJS** framework with Express adapter
- **Prisma** ORM via `@calcom/prisma` for database access
- **Redis** for rate limiting (`@nestjs/throttler`) and Bull job queues
- **Swagger/OpenAPI** for auto-generated API documentation
- **Sentry** for error monitoring, **Winston** for structured logging

### Directory Structure

```
src/
├── main.ts                  # Entrypoint: creates NestJS app, starts listening
├── app.ts                   # Bootstrap: configures CORS, versioning, filters, pipes
├── app.module.ts            # Root module: wires imports, guards, interceptors
├── modules/                 # Core NestJS feature modules
│   ├── auth/                # Authentication guards and strategies
│   ├── prisma/              # Database access (wraps @calcom/prisma)
│   ├── redis/               # Shared Redis connection
│   ├── endpoints.module.ts  # Aggregates all endpoint modules
│   ├── organizations/       # Org management (teams, users, bookings)
│   ├── oauth-clients/       # OAuth client CRUD for platform partners
│   └── ...                  # billing, slots, webhooks, event-types, etc.
├── ee/                      # Enterprise edition endpoints
│   ├── bookings/            # Versioned booking endpoints (e.g., 2024-08-13/)
│   ├── event-types/         # Versioned event type endpoints (e.g., 2024_06_14/)
│   ├── schedules/           # Schedule management
│   └── platform-endpoints-module.ts  # Aggregates all EE modules
├── filters/                 # Exception filters (Prisma, Zod, HTTP, tRPC)
├── middleware/               # Request middleware (logging, body parsing, redirects)
└── swagger/                 # OpenAPI spec generation
```

### Key Entrypoints

**`src/main.ts`** - Creates the NestJS app from `AppModule` with Winston logging, calls `bootstrap()` to configure middleware, generates Swagger docs, and starts listening (default port 3003).

**`src/app.ts`** (bootstrap function) - Applies production middleware:
- Custom header-based API versioning (`cal-api-version` header, fallback `VERSION_2024_04_15`)
- Helmet security headers, CORS (all origins, specific allowed headers)
- Global `ValidationPipe` with whitelist mode
- Layered exception filters: Prisma > Zod > HTTP > tRPC > CalendarService

**`src/app.module.ts`** - Root module composing: ConfigModule (global), Redis + Bull (job queues), ThrottlerModule (rate limiting), Prisma, Auth, JWT, and all endpoint modules. Middleware pipeline: RawBody (webhooks) > JSON > RequestID > Logger > Redirects > Rewrites.

### API Versioning

Date-based versioning via `cal-api-version` header. Each version has its own Input/Output DTOs and transformation services to ensure API stability independent of internal schema changes.

### Connection to Monorepo

| Package | Role |
|---|---|
| `@calcom/prisma` | Database access via `PrismaModule` |
| `@calcom/platform-constants` | API version constants, header names |
| `@calcom/platform-types` | Versioned Input/Output DTOs |
| `@calcom/platform-libraries` | Shared business logic from `@calcom/features` |

## Installation

```bash
$ yarn install
```

## Prisma setup

```bash
$ yarn prisma generate
```

## Env setup

Copy `.env.example` to `.env` and fill values.

## Add license Key to Deployment table in DB

id, logo, theme, licenseKey, agreedLicenseAt:-
1, null, null, '00000000-0000-0000-0000-000000000000', '2023-05-15 21:39:47.611'

Replace with your actual license key.

your CALCOM_LICENSE_KEY env var need to contain the same value

.env
CALCOM_LICENSE_KEY=00000000-0000-0000-0000-000000000000

## Running the app

### Development

```bash
$ yarn run start
```

OR if you don't want to use docker, you can run following command.

```bash
$ yarn dev:no-docker
```

Additionally you can run following command(in different terminal) to ensure that any change in any of the dependencies is rebuilt and detected. It watches platform-libraries, platform-constants, platform-enums, platform-utils, platform-types.

```bash
$ yarn run dev:build:watch
```

If you are making changes in packages/platform/libraries, you should run the following command too that would connect your local packages/platform/libraries to the api/v2

```bash
$ yarn local
```

### Watch mode
```bash
$ yarn run start:dev
```

### Production mode
```bash
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# e2e tests in watch mode
$ yarn test:e2e:watch

# run specific e2e test file in watch mode
$ yarn test:e2e:watch --testPathPattern=filePath

# test coverage
$ yarn run test:cov
```

## Conventions

### Guards
1. In case a guard would return "false" for "canActivate" instead throw ForbiddenException with an error message containing guard name and the error.
2. In case a guard would return "false" for "canActivate" DO NOT cache the result in redis, because we don't want that someone is forbidden, updates whatever was the problem, and then has to wait for cache to expire. We only cache in redis guard results where "canAccess" is "true".
3. If you use ApiAuthGuard but want that only specific auth method is allowed, for example, api key, then you also need to add `@ApiAuthGuardOnlyAllow(["API_KEY"])` under the `@UseGuards(ApiAuthGuard)`. Shortly, use `ApiAuthGuardOnlyAllow` to specify which auth methods are allowed by `ApiAuthGuard`. If `ApiAuthGuardOnlyAllow` is not used or nothing is passed to it or empty array it means that
all auth methods are allowed.

### Authentication
Multiple auth strategies: API Key (`Authorization: Bearer cal_...`), OAuth (platform partners), Session (cookie-based NextAuth), and Access Tokens. Use `@UseGuards(ApiAuthGuard)` and restrict with `@ApiAuthGuardOnlyAllow(["API_KEY"])`.

## License

Nest is [MIT licensed](LICENSE).
