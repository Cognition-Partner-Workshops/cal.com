# @calcom/features

Core business logic for Cal.com. This package contains the domain logic, UI components, and service layers for all major features: bookings, event types, schedules, availability, payments, workflows, and more.

## Architecture Overview

### Role in the Monorepo

`@calcom/features` sits between the UI layer (apps/web, @calcom/ui) and the data layer (@calcom/prisma, @calcom/trpc). It contains:

1. **Business logic** - Functions that implement scheduling rules (e.g., `handleNewBooking`, `handleCancelBooking`, `getLuckyUser` for round-robin)
2. **Feature UI components** - Complex React components that combine UI primitives with business logic (e.g., `Booker`, `Shell`, schedule editors)
3. **Service layers** - Orchestration classes for bookings, events, payments, and integrations
4. **Hooks** - React hooks that encapsulate feature-specific data fetching and state

### Directory Structure

```
packages/features/
├── bookings/                  # Booking creation, cancellation, confirmation
│   ├── Booker/               # Primary booking UI component (date/time picker + form)
│   ├── lib/                  # Core booking logic
│   │   ├── handleNewBooking/     # New booking orchestration (routes to Regular/Recurring/Instant)
│   │   ├── handleCancelBooking/  # Cancellation with refunds, calendar cleanup, webhooks
│   │   ├── handleConfirmation.ts # Confirms pending bookings, creates calendar events
│   │   ├── handleSeats/         # Seated event booking logic
│   │   ├── EventManager.ts     # Calendar/video integration orchestrator
│   │   ├── getLuckyUser.ts     # Round-robin host assignment algorithm
│   │   └── payment/           # Payment processing (Stripe, HitPay)
│   ├── services/             # Booking service classes (Regular, Recurring, Instant)
│   ├── repositories/         # Data access layer for bookings
│   └── hooks/                # React hooks for booking operations
├── eventtypes/               # Event type management and configuration
├── schedules/                # Availability schedule management
│   ├── components/           # Schedule editor UI (working hours, date overrides)
│   └── lib/                  # Schedule utilities and hooks (useSchedule)
├── shell/                    # Application shell (navigation, sidebar, header)
├── auth/                     # Authentication flows and utilities
├── ee/                       # Enterprise edition features
│   ├── payments/            # Payment processing (Stripe integration)
│   ├── teams/               # Team management and billing
│   ├── managed-event-types/ # Parent-child event type system
│   └── workflows/           # Email/SMS automation workflows
├── apps/                     # App store integration logic
├── webhooks/                 # Webhook management and delivery
├── calendars/                # Calendar synchronization logic
├── embed/                    # Embed-specific components and logic
├── insights/                 # Analytics and reporting
├── flags/                    # Feature flag system
│   └── server/router.ts     # Feature flag tRPC router
├── credentials/              # Credential management
├── notifications/            # Push notification system
└── ...                       # 40+ more feature directories
```

### Key Subsystems

#### Booking Lifecycle (`bookings/`)

The booking system is the core of Cal.com. Key files:

- **`handleNewBooking/`** - Orchestrates new booking creation. Routes to `RegularBookingService`, `RecurringBookingService`, or `InstantBookingCreateService` based on event configuration. Validates availability, checks limits, reserves slots, processes payments, and triggers webhooks.
- **`handleCancelBooking.ts`** - Cancels bookings with support for recurring events, seated events, and payment refunds. Deletes calendar events, sends notifications, triggers BOOKING_CANCELLED webhooks.
- **`handleConfirmation.ts`** - Confirms pending bookings (for `requiresConfirmation` event types). Creates calendar events via `EventManager`, sends confirmation emails, schedules workflows.
- **`EventManager.ts`** - Orchestrates calendar and video integrations. Creates/updates/deletes events in Google Calendar, Office365, Zoom, Daily.co, etc. Uses `Credential` model for OAuth tokens.
- **`getLuckyUser.ts`** - Round-robin host assignment algorithm considering host weights, priorities, recent bookings, and availability.

#### Booker Component (`bookings/Booker/`)

The primary public-facing scheduling UI. Manages:
- Date selection (month/week/column views)
- Time slot display from `useSchedule` hook
- Booking form with dynamic fields
- Reschedule and recurring booking flows
- State via `BookerStore` (Zustand) synced to URL params

#### Schedule Management (`schedules/`)

- Schedule editor UI with working hours and date overrides
- `useSchedule` hook for fetching available slots (calls `viewer.slots.getSchedule` tRPC procedure)
- Timezone-aware availability calculations

#### Application Shell (`shell/`)

Layout wrapper providing navigation, header, sidebar, and user menu for all authenticated pages. Used by `apps/web/modules/` views.

### Connection to Monorepo

| Package | Relationship |
|---|---|
| `@calcom/prisma` | Direct database access for business logic operations |
| `@calcom/trpc` | Procedure handlers import from `@calcom/features` for business logic |
| `@calcom/ui` | Feature components use UI primitives (Button, Dialog, Form, etc.) |
| `@calcom/lib` | Shared utilities (date handling, i18n, constants) |
| `@calcom/app-store` | Integration definitions and credential handling |
| `apps/web` | Imports feature components into `modules/` views |
| `apps/api/v2` | Uses feature logic via `@calcom/platform-libraries` |

### Patterns and Conventions

- **Service pattern**: Complex operations (booking creation, cancellation) use service classes that orchestrate multiple steps (validation, database writes, integrations, notifications).
- **Repository pattern**: Data access is abstracted through repository classes in `repositories/` directories.
- **Dependency injection**: The `di/` directory provides a lightweight DI container for swapping service implementations (e.g., testing).
- **EE separation**: Enterprise features live in `ee/` subdirectories and are gated by license checks at runtime.
- **Feature flags**: New features can be gated using the `flags/` system, with a tRPC router for client-side flag queries.
