<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://cal.com/docs/enterprise-features/api#api-server-specifications">
    <img src="https://user-images.githubusercontent.com/8019099/133430653-24422d2a-3c8d-4052-9ad6-0580597151ee.png" alt="Logo">
  </a>
  
  <a href="https://cal.com/docs/enterprise-features/api#api-server-specifications">Read the API docs</a>
</div>

# @calcom/api (v1) - Legacy REST API

> **Status: Maintenance mode.** New features and integrations should use [API v2](../v2/README.md) (`apps/api/v2/`), which is built on NestJS with versioned endpoints and OpenAPI documentation.

Legacy REST API for Cal.com built as a standalone Next.js application. It exposes CRUD endpoints for core scheduling resources (event types, bookings, schedules, users, teams) and authenticates via API key query parameters.

## Architecture Overview

This API runs as a separate Next.js app within the monorepo (port 3002). Unlike the main web app which uses tRPC, this API uses standard Next.js API routes (`pages/api/`) with Zod validation and custom middleware for authentication and request processing.

### Directory Structure

```
apps/api/v1/
├── pages/api/           # Next.js API route handlers
│   ├── event-types/     # Event type CRUD (/v1/event-types)
│   ├── bookings/        # Booking CRUD (/v1/bookings)
│   ├── schedules/       # Schedule CRUD (/v1/schedules)
│   ├── users/           # User management (/v1/users)
│   ├── teams/           # Team management (/v1/teams)
│   ├── attendees/       # Attendee management
│   ├── availabilities/  # Availability queries
│   ├── webhooks/        # Webhook CRUD
│   ├── slots/           # Available slot queries
│   └── docs.ts          # OpenAPI/Swagger spec endpoint
├── lib/
│   ├── validations/     # Zod validation schemas per resource
│   └── helpers/         # Shared utilities (verifyApiKey, withMiddleware)
├── next.config.js       # Redirects /v1/* to /api/v1/*, transpiles monorepo packages
└── package.json         # @calcom/api
```

### Connection to Monorepo

| Package | Role |
|---|---|
| `@calcom/prisma` | Direct database access for all CRUD operations |
| `@calcom/lib` | Shared utilities (date handling, constants) |
| `@calcom/features` | Business logic for bookings and event types |
| `@calcom/app-store` | Integration metadata and credential handling |

### Key Patterns

- **Middleware chain**: `withMiddleware()` wraps each endpoint with API key verification, HTTP method validation, and error handling via `next-api-middleware`
- **Validation schemas**: Each resource has Zod schemas in `lib/validations/` with `BaseBodyParams` (input), `Public` (output), and `BodyParams` (merged) variants
- **OpenAPI annotations**: Each endpoint has `@swagger` YAML comments that auto-generate the spec served at `/docs`

## Stack

- Next.js (API routes only)
- TypeScript
- Prisma (via `@calcom/prisma`)
- Zod (request/response validation)

## Development

### Setup

1. Clone the main repo (NOT THIS ONE)

   ```sh
   git clone --recurse-submodules -j8 https://github.com/calcom/cal.com.git
   ```

1. Go to the project folder

   ```sh
   cd cal.com
   ```

1. Copy `apps/api/.env.example` to `apps/api/.env`

   ```sh
   cp apps/api/.env.example apps/api/.env
   cp .env.example .env
   ```

1. Install packages with yarn

   ```sh
   yarn
   ```

1. Start developing

   ```sh
   yarn workspace @calcom/api dev
   ```

1. Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

## API Authentication (API Keys)

The API requires a valid apiKey query param to be passed:
You can generate them at <https://app.cal.com/settings/security>

For example:

```sh
GET https://api.cal.com/v1/users?apiKey={INSERT_YOUR_CAL.COM_API_KEY_HERE}
```

API Keys optionally may have expiry dates, if they are expired they won't work. If you create an apiKey without a userId relation, it won't work either for now as it relies on it to establish the current authenticated user.

In the future we might add support for header Bearer Auth if we need to or if our customers require it.

## Middlewares

We don't use the new NextJS 12 Beta Middlewares, mainly because they run on the edge, and are not able to call prisma from api endpoints. We use instead a very nifty library called next-api-middleware that let's us use a similar approach building our own middlewares and applying them as we see fit.

- withMiddleware() requires some default middlewares (verifyApiKey, etc...)

## Next.config.js

### Redirects

Since this is an API only project, we don't want to have to type /api/ in all the routes, and so redirect all traffic to api, so a call to `api.cal.com/v1` will resolve to `api.cal.com/api/v1`

Likewise, v1 is added as param query called version to final /api call so we don't duplicate endpoints in the future for versioning if needed.

### Transpiling locally shared monorepo modules

We're calling several packages from monorepo, this need to be transpiled before building since are not available as regular npm packages. That's what withTM does.

```js
  "@calcom/app-store",
  "@calcom/prisma",
  "@calcom/lib",
  "@calcom/features",
```

## API Endpoint Validation

We validate that only the supported methods are accepted at each endpoint, so in

- **/endpoint**: you can only [GET] (all) and [POST] (create new)
- **/endpoint/id**: you can read create and edit [GET, PATCH, DELETE]

### Zod Validations

The API uses `zod` library like our main web repo. It validates that either GET query parameters or POST body content's are valid and up to our spec. It gives errors when parsing result's with schemas and failing validation.

We use it in several ways, but mainly, we first import the auto-generated schema from @calcom/prisma for each model, which lives in `lib/validations/`

We have some shared validations which several resources require, like baseApiParams which parses apiKey in all requests, or querIdAsString or TransformParseInt which deal with the id's coming from req.query.

- **[*]BaseBodyParams** that omits any values from the model that are too sensitive or we don't want to pick when creating a new resource like id, userId, etc.. (those are gotten from context or elsewhere)

- **[*]Public** that also omits any values that we don't want to expose when returning the model as a response, which we parse against before returning all resources.

- **[*]BodyParams** which merges both `[*]BaseBodyParams.merge([*]RequiredParams);`

### Next Validations

[Next-Validations Docs](https://next-validations.productsway.com/)
[Next-Validations Repo](https://github.com/jellydn/next-validations)
We also use this useful helper library that let us wrap our endpoints in a validate HOC that checks the req against our validation schema built out with zod for either query and / or body's requests.

## Testing with Jest + node-mocks-http

We aim to provide a fully tested API for our peace of mind, this is accomplished by using jest + node-mocks-http

## Endpoints matrix

| resource              | get [id] | get all | create | edit | delete |
| --------------------- | -------- | ------- | ------ | ---- | ------ |
| attendees             | ✅       | ✅      | ✅     | ✅   | ✅     |
| availabilities        | ✅       | ✅      | ✅     | ✅   | ✅     |
| booking-references    | ✅       | ✅      | ✅     | ✅   | ✅     |
| event-references      | ✅       | ✅      | ✅     | ✅   | ✅     |
| destination-calendars | ✅       | ✅      | ✅     | ✅   | ✅     |
| custom-inputs         | ✅       | ✅      | ✅     | ✅   | ✅     |
| event-types           | ✅       | ✅      | ✅     | ✅   | ✅     |
| memberships           | ✅       | ✅      | ✅     | ✅   | ✅     |
| payments              | ✅       | ✅      | ❌     | ❌   | ❌     |
| schedules             | ✅       | ✅      | ✅     | ✅   | ✅     |
| selected-calendars    | ✅       | ✅      | ✅     | ✅   | ✅     |
| teams                 | ✅       | ✅      | ✅     | ✅   | ✅     |
| users                 | ✅       | 👤[1]   | ✅     | ✅   | ✅     |

## Models from database that are not exposed

mostly because they're deemed too sensitive can be revisited if needed. Also they are expected to be used via cal's webapp.

- [ ] Api Keys
- [ ] Credentials
- [ ] Webhooks
- [ ] ResetPasswordRequest
- [ ] VerificationToken
- [ ] ReminderMail

## Documentation (OpenAPI)

You will see that each endpoint has a comment at the top with the annotation `@swagger` with the documentation of the endpoint, **please update it if you change the code!** This is what auto-generates the OpenAPI spec by collecting the YAML in each endpoint and parsing it in /docs alongside the json-schema (auto-generated from prisma package, not added to code but manually for now, need to fix later)

### @calcom/apps/swagger

The documentation of the API lives inside the code, and it's auto-generated, the only endpoints that return without a valid apiKey are the homepage, with a JSON message redirecting you to the docs. and the /docs endpoint, which returns the OpenAPI 3.0 JSON Spec. Which SwaggerUi then consumes and generates the docs on.

## Deployment

`scripts/vercel-deploy.sh`
The API is deployed to vercel.com, it uses a similar deployment script to website or webapp, and requires transpilation of several shared packages that are part of our turborepo ["app-store", "prisma", "lib", "ee"]
in order to build and deploy properly.

## Envirorment variables

### Required

DATABASE_URL=DATABASE_URL="postgresql://postgres:@localhost:5450/calendso"

## Optional

API*KEY_PREFIX=cal*# This can be changed per envirorment so cal*test* for staging for example.

> If you're self-hosting under our commercial license, you can use any prefix you want for api keys. either leave the default cal\_ (not providing any envirorment variable) or modify it

**Ensure that while testing swagger, API project should be run in production mode**
We make sure of this by not using next in dev, but next build && next start, if you want hot module reloading and such when developing, please use yarn run next directly on apps/api.

See <https://github.com/vercel/next.js/blob/canary/packages/next/server/dev/hot-reloader.ts#L79>. Here in dev mode OPTIONS method is hardcoded to return only GET and OPTIONS as allowed method. Running in Production mode would cause this file to be not used. This is hot-reloading logic only.
To remove this limitation, we need to ensure that on local endpoints are requested by swagger at /api/v1 and not /v1

## How to deploy

We recommend deploying API in vercel.

There's some settings that you'll need to setup.

Under Vercel > Your API Project > Settings

In General > Build & Development Settings
BUILD COMMAND: `yarn turbo run build --filter=@calcom/api --no-deps`
OUTPUT DIRECTORY: `apps/api/.next`

In Git > Ignored Build Step

Add this command: `./scripts/vercel-deploy.sh`

See `scripts/vercel-deploy.sh` for more info on how the deployment is done.

> _❗ IMPORTANT: If you're forking the API repo you will need to update the URLs in both the main repo [`.gitmodules`](https://github.com/calcom/cal.com/blob/main/.gitmodules#L7) and this repo [`./scripts/vercel-deploy.sh`](https://github.com/calcom/api/blob/main/scripts/vercel-deploy.sh#L3) ❗_

## Environment variables

Lastly API requires an env var for `DATABASE_URL` and `CALCOM_LICENSE_KEY`
