"use client";

import dayjs from "@calcom/dayjs";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { RouterOutputs } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Icon } from "@calcom/ui/components/icon";
import Link from "next/link";
import type { ReactElement } from "react";

type Booking = RouterOutputs["viewer"]["bookings"]["get"]["bookings"][number];

type UpcomingBookingsProps = {
  bookings: Booking[];
  userTimeZone?: string;
  userTimeFormat?: number | null;
};

export function UpcomingBookings({
  bookings,
  userTimeZone,
  userTimeFormat,
}: UpcomingBookingsProps): ReactElement {
  const { t } = useLocale();

  const formatTime = (date: Date | string): string => {
    const d = dayjs(date);
    let format = "HH:mm";
    if (userTimeFormat === 12) {
      format = "h:mm A";
    }
    if (userTimeZone) {
      return d.tz(userTimeZone).format(format);
    }
    return d.format(format);
  };

  const formatDate = (date: Date | string): string => {
    const d = dayjs(date);
    if (userTimeZone) {
      return d.tz(userTimeZone).format("ddd, MMM D");
    }
    return d.format("ddd, MMM D");
  };

  const getStatusBadge = (status: string): ReactElement => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <Badge variant="success">{t("confirmed")}</Badge>;
      case "pending":
        return <Badge variant="orange">{t("pending")}</Badge>;
      case "cancelled":
        return <Badge variant="error">{t("cancelled")}</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="border-subtle bg-default rounded-md border p-6">
        <h3 className="text-emphasis mb-4 text-lg font-semibold">{t("upcoming_bookings")}</h3>
        <EmptyScreen
          Icon="calendar"
          headline={t("no_upcoming_bookings")}
          description={t("no_upcoming_bookings_description")}
          buttonRaw={
            <Link href="/event-types">
              <Button>{t("create_event_type")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="border-subtle bg-default rounded-md border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-emphasis text-lg font-semibold">{t("upcoming_bookings")}</h3>
        <Link href="/bookings/upcoming">
          <Button color="minimal" EndIcon="arrow-right">
            {t("view_all")}
          </Button>
        </Link>
      </div>

      <div className="divide-subtle divide-y">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="bg-subtle flex h-12 w-12 flex-col items-center justify-center rounded-lg">
                <span className="text-emphasis text-xs font-medium">
                  {dayjs(booking.startTime).format("MMM")}
                </span>
                <span className="text-emphasis text-lg font-bold">
                  {dayjs(booking.startTime).format("D")}
                </span>
              </div>
              <div>
                <p className="text-emphasis font-medium">{booking.title}</p>
                <div className="text-subtle flex items-center gap-2 text-sm">
                  <Icon name="clock" className="h-4 w-4" />
                  <span>
                    {formatDate(booking.startTime)} {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </span>
                </div>
                {booking.attendees && booking.attendees.length > 0 && (
                  <div className="text-subtle flex items-center gap-2 text-sm">
                    <Icon name="user" className="h-4 w-4" />
                    <span>{booking.attendees.map((a) => a.name || a.email).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              <Link href={`/booking/${booking.uid}`}>
                <Button color="minimal" variant="icon" StartIcon="external-link" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
