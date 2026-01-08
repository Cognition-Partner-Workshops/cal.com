"use client";

import type { RouterOutputs } from "@calcom/trpc/react";
import type { ReactElement } from "react";

import { AvailabilityOverview } from "./components/AvailabilityOverview";
import { QuickActions } from "./components/QuickActions";
import { SchedulerStats } from "./components/SchedulerStats";
import { UpcomingBookings } from "./components/UpcomingBookings";

type SchedulerDashboardProps = {
  upcomingBookings: RouterOutputs["viewer"]["bookings"]["get"];
  availabilities: RouterOutputs["viewer"]["availability"]["list"];
  eventTypes: RouterOutputs["viewer"]["eventTypes"]["getByViewer"];
  userTimeZone?: string;
  userTimeFormat?: number | null;
};

export default function SchedulerDashboard({
  upcomingBookings,
  availabilities,
  eventTypes,
  userTimeZone,
  userTimeFormat,
}: SchedulerDashboardProps): ReactElement {
  const totalBookings = upcomingBookings.totalCount;
  const upcomingCount = upcomingBookings.bookings.length;
  const totalSchedules = availabilities.schedules.length;
  const totalEventTypes =
    eventTypes.eventTypeGroups?.reduce((acc, group) => acc + (group.eventTypes?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <SchedulerStats
        totalBookings={totalBookings}
        upcomingCount={upcomingCount}
        totalSchedules={totalSchedules}
        totalEventTypes={totalEventTypes}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingBookings
            bookings={upcomingBookings.bookings}
            userTimeZone={userTimeZone}
            userTimeFormat={userTimeFormat}
          />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <AvailabilityOverview schedules={availabilities.schedules} />
        </div>
      </div>
    </div>
  );
}
