// endpoints.module.ts — Aggregates all API endpoint modules into one import.
//
// AppModule imports this single module instead of each endpoint module individually.
// This keeps AppModule focused on global concerns (auth, config, rate limiting)
// while EndpointsModule manages the full set of REST controllers.
//
// Module groups:
//   - Core: OAuthClient, Billing, Users, Webhooks, Timezones, Stripe, Conferencing
//   - Organization: Teams bookings, Users bookings, Routing forms, Schedules
//   - Platform EE: Versioned booking/event-type/schedule endpoints via PlatformEndpointsModule
//   - Atoms: Embeddable UI component endpoints

import { PlatformEndpointsModule } from "@/ee/platform-endpoints-module";
import { AtomsModule } from "@/modules/atoms/atoms.module";
import { BillingModule } from "@/modules/billing/billing.module";
import { CalUnifiedCalendarsModule } from "@/modules/cal-unified-calendars/cal-unified-calendars.module";
import { ConferencingModule } from "@/modules/conferencing/conferencing.module";
import { DestinationCalendarsModule } from "@/modules/destination-calendars/destination-calendars.module";
import { OAuthClientModule } from "@/modules/oauth-clients/oauth-client.module";
import { OrganizationsBookingsModule } from "@/modules/organizations/bookings/organizations.bookings.module";
import { OrganizationsRoutingFormsModule } from "@/modules/organizations/routing-forms/organizations-routing-forms.module";
import { OrganizationsTeamsBookingsModule } from "@/modules/organizations/teams/bookings/organizations-teams-bookings.module";
import { OrganizationsUsersBookingsModule } from "@/modules/organizations/users/bookings/organizations-users-bookings.module";
import { RouterModule } from "@/modules/router/router.module";
import { StripeModule } from "@/modules/stripe/stripe.module";
import { TeamsSchedulesModule } from "@/modules/teams/schedules/teams-schedules.module";
import { TimezoneModule } from "@/modules/timezones/timezones.module";
import { VerifiedResourcesModule } from "@/modules/verified-resources/verified-resources.module";
import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

import { UsersModule } from "./users/users.module";
import { WebhooksModule } from "./webhooks/webhooks.module";

@Module({
  imports: [
    OAuthClientModule,
    BillingModule,
    PlatformEndpointsModule,
    TimezoneModule,
    UsersModule,
    WebhooksModule,
    DestinationCalendarsModule,
    AtomsModule,
    StripeModule,
    ConferencingModule,
    CalUnifiedCalendarsModule,
    OrganizationsTeamsBookingsModule,
    OrganizationsUsersBookingsModule,
    OrganizationsBookingsModule,
    OrganizationsRoutingFormsModule,
    VerifiedResourcesModule,
    RouterModule,
    TeamsSchedulesModule,
  ],
})
export class EndpointsModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {
    // TODO: apply ratelimits
  }
}
