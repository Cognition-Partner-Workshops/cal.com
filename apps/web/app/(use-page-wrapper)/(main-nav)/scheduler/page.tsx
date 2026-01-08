import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { availabilityRouter } from "@calcom/trpc/server/routers/viewer/availability/_router";
import { bookingsRouter } from "@calcom/trpc/server/routers/viewer/bookings/_router";
import { eventTypesRouter } from "@calcom/trpc/server/routers/viewer/eventTypes/_router";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { createRouterCaller, getTRPCContext } from "app/_trpc/context";
import type { ReadonlyHeaders, ReadonlyRequestCookies } from "app/_types";
import { _generateMetadata, getTranslate } from "app/_utils";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import SchedulerDashboard from "~/scheduler/scheduler-view";

import { ShellMainAppDir } from "../ShellMainAppDir";

const getCachedUpcomingBookings = unstable_cache(
  async (headers: ReadonlyHeaders, cookies: ReadonlyRequestCookies) => {
    const bookingsCaller = await createRouterCaller(bookingsRouter, await getTRPCContext(headers, cookies));
    return await bookingsCaller.get({
      limit: 5,
      offset: 0,
      filters: {
        status: "upcoming",
      },
    });
  },
  ["viewer.bookings.upcoming"],
  { revalidate: 60 }
);

const getCachedAvailabilities = unstable_cache(
  async (headers: ReadonlyHeaders, cookies: ReadonlyRequestCookies) => {
    const availabilityCaller = await createRouterCaller(
      availabilityRouter,
      await getTRPCContext(headers, cookies)
    );
    return await availabilityCaller.list();
  },
  ["viewer.availability.list"],
  { revalidate: 3600 }
);

const getCachedEventTypes = unstable_cache(
  async (headers: ReadonlyHeaders, cookies: ReadonlyRequestCookies) => {
    const eventTypesCaller = await createRouterCaller(
      eventTypesRouter,
      await getTRPCContext(headers, cookies)
    );
    return await eventTypesCaller.getByViewer({});
  },
  ["viewer.eventTypes.getByViewer"],
  { revalidate: 3600 }
);

async function Page(): Promise<ReactElement> {
  const t = await getTranslate();
  const _headers = await headers();
  const _cookies = await cookies();
  const session = await getServerSession({ req: buildLegacyRequest(_headers, _cookies) });

  if (!session?.user?.id) {
    return redirect("/auth/login");
  }

  const [upcomingBookings, availabilities, eventTypes] = await Promise.all([
    getCachedUpcomingBookings(_headers, _cookies),
    getCachedAvailabilities(_headers, _cookies),
    getCachedEventTypes(_headers, _cookies),
  ]);

  return (
    <ShellMainAppDir heading={t("scheduler_platform")} subtitle={t("scheduler_platform_description")}>
      <SchedulerDashboard
        upcomingBookings={upcomingBookings}
        availabilities={availabilities}
        eventTypes={eventTypes}
      />
    </ShellMainAppDir>
  );
}

async function generateMetadata(): Promise<Metadata> {
  return await _generateMetadata(
    (t) => t("scheduler_platform"),
    (t) => t("scheduler_platform_description"),
    undefined,
    undefined,
    "/scheduler"
  );
}

export { generateMetadata };
export default Page;
