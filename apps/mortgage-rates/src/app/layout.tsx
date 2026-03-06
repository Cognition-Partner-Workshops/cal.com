import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mortgage Rate Finder | Current Rates by Location",
  description:
    "Find today's mortgage rates for different terms based on your location. Compare 30-year fixed, 15-year fixed, ARM, FHA, and VA loan rates across all US states.",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
