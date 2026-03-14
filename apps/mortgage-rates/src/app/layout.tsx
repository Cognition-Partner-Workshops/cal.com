import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "Mortgage Rate Finder | Current Rates by Location",
  description:
    "Find today's mortgage rates for different terms based on your location. Compare 30-year fixed, 15-year fixed, ARM, FHA, and VA loan rates across all US states.",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased transition-colors dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
