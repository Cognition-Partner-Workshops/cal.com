"use client";

import type { JSX } from "react";

import type { DataSourceResult } from "../lib/types";

type DataSourceCardProps = {
  title: string;
  infoNeeded: string;
  result: DataSourceResult<Record<string, unknown>>;
};

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") {
    if (value) return "Yes";
    return "No";
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join(", ");
  }
  return String(value);
}

export function DataSourceCard({ title, infoNeeded, result }: DataSourceCardProps): JSX.Element {
  return (
    <div className="border-subtle bg-default rounded-lg border p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-emphasis text-sm font-semibold">{title}</h3>
        <span className="bg-subtle text-default rounded-full px-2.5 py-0.5 text-xs font-medium">
          {result.sourceType}
        </span>
      </div>
      <div className="mb-2">
        <p className="text-subtle text-xs">
          Info Needed: <span className="text-emphasis font-medium">{infoNeeded}</span>
        </p>
        <p className="text-subtle text-xs">
          Source: <span className="text-emphasis font-medium">{result.source}</span>
        </p>
      </div>
      <div className="border-subtle mt-3 border-t pt-3">
        <dl className="space-y-1.5">
          {Object.entries(result.data).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2 text-xs">
              <dt className="text-subtle min-w-[100px] font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </dt>
              <dd className="text-emphasis">{formatValue(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-muted mt-2 text-[10px]">Fetched: {result.fetchedAt}</p>
    </div>
  );
}
