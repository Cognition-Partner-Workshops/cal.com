"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { RouterOutputs } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { EmptyScreen } from "@calcom/ui/components/empty-screen";
import { Icon } from "@calcom/ui/components/icon";
import Link from "next/link";
import type { ReactElement } from "react";

type Schedule = RouterOutputs["viewer"]["availability"]["list"]["schedules"][number];

type AvailabilityOverviewProps = {
  schedules: Schedule[];
};

export function AvailabilityOverview({ schedules }: AvailabilityOverviewProps): ReactElement {
  const { t } = useLocale();

  if (schedules.length === 0) {
    return (
      <div className="border-subtle bg-default rounded-md border p-6">
        <h3 className="text-emphasis mb-4 text-lg font-semibold">{t("availability")}</h3>
        <EmptyScreen
          Icon="clock"
          headline={t("no_schedules")}
          description={t("no_schedules_description")}
          buttonRaw={
            <Link href="/availability">
              <Button>{t("create_schedule")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="border-subtle bg-default rounded-md border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-emphasis text-lg font-semibold">{t("availability")}</h3>
        <Link href="/availability">
          <Button color="minimal" EndIcon="arrow-right">
            {t("manage")}
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {schedules.slice(0, 3).map((schedule) => (
          <Link
            key={schedule.id}
            href={`/availability/${schedule.id}`}
            className="hover:bg-subtle block rounded-lg border p-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-subtle rounded-lg p-2">
                  <Icon name="calendar-days" className="text-emphasis h-4 w-4" />
                </div>
                <div>
                  <p className="text-emphasis font-medium">{schedule.name}</p>
                  {schedule.isDefault && (
                    <Badge variant="gray" className="mt-1">
                      {t("default")}
                    </Badge>
                  )}
                </div>
              </div>
              <Icon name="chevron-right" className="text-subtle h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      {schedules.length > 3 && (
        <div className="text-subtle mt-3 text-center text-sm">
          {t("and_more_schedules", { count: schedules.length - 3 })}
        </div>
      )}
    </div>
  );
}
