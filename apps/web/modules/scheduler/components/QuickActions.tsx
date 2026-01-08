"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import Link from "next/link";
import type { ReactElement } from "react";

export function QuickActions(): ReactElement {
  const { t } = useLocale();

  const actions = [
    {
      label: t("new_event_type"),
      href: "/event-types?dialog=new",
      icon: "plus" as const,
      description: t("new_event_type_description"),
    },
    {
      label: t("manage_availability"),
      href: "/availability",
      icon: "clock" as const,
      description: t("manage_availability_description"),
    },
    {
      label: t("view_bookings"),
      href: "/bookings/upcoming",
      icon: "calendar" as const,
      description: t("view_bookings_description"),
    },
    {
      label: t("settings"),
      href: "/settings/my-account/profile",
      icon: "settings" as const,
      description: t("settings_description"),
    },
  ];

  return (
    <div className="border-subtle bg-default rounded-md border p-6">
      <h3 className="text-emphasis mb-4 text-lg font-semibold">{t("quick_actions")}</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <Button color="secondary" className="w-full justify-start" StartIcon={action.icon}>
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-subtle text-xs">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
