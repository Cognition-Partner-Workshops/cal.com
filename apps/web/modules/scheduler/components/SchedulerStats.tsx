"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Icon } from "@calcom/ui/components/icon";
import type { ReactElement } from "react";

type SchedulerStatsProps = {
  totalBookings: number;
  upcomingCount: number;
  totalSchedules: number;
  totalEventTypes: number;
};

export function SchedulerStats({
  totalBookings,
  upcomingCount,
  totalSchedules,
  totalEventTypes,
}: SchedulerStatsProps): ReactElement {
  const { t } = useLocale();

  const stats = [
    {
      label: t("total_bookings"),
      value: totalBookings,
      icon: "calendar" as const,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      label: t("upcoming"),
      value: upcomingCount,
      icon: "clock" as const,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      label: t("schedules"),
      value: totalSchedules,
      icon: "calendar-days" as const,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      label: t("event_types"),
      value: totalEventTypes,
      icon: "link" as const,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="border-subtle bg-default rounded-md border p-4">
          <div className="flex items-center gap-4">
            <div className={`rounded-lg p-3 ${stat.color}`}>
              <Icon name={stat.icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="text-subtle text-sm font-medium">{stat.label}</p>
              <p className="text-emphasis text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
