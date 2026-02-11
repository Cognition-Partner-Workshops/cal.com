"use client";

import classNames from "@calcom/ui/classNames";
import type { JSX } from "react";

type MappingRow = {
  infoNeeded: string;
  whereItLives: string;
};

const MAPPING_ROWS: MappingRow[] = [
  { infoNeeded: "Product = Snow blower", whereItLives: "Confluence / Product catalog" },
  { infoNeeded: "Product ID", whereItLives: "Confluence" },
  { infoNeeded: "Offer = 50%", whereItLives: "NoSQL (promotions DB)" },
  { infoNeeded: "Store in Toronto", whereItLives: "SQL (store DB)" },
  { infoNeeded: "Store inventory", whereItLives: "SQL" },
  { infoNeeded: "Maybe UI scrape", whereItLives: "Web/UI system" },
];

function getRowClassName(index: number): string {
  if (index % 2 === 0) return "bg-default";
  return "bg-subtle";
}

export function DataSourceMappingTable(): JSX.Element {
  return (
    <div className="border-subtle bg-default overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="bg-subtle">
            <th className="text-emphasis px-4 py-3 text-left text-sm font-semibold">Info Needed</th>
            <th className="text-emphasis px-4 py-3 text-left text-sm font-semibold">Where It Lives</th>
          </tr>
        </thead>
        <tbody>
          {MAPPING_ROWS.map((row, index) => (
            <tr key={row.infoNeeded} className={classNames(getRowClassName(index))}>
              <td className="text-default px-4 py-2.5 text-sm">{row.infoNeeded}</td>
              <td className="text-default px-4 py-2.5 text-sm">{row.whereItLives}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
