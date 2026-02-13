// _app.tsx — Root application component for the Cal.com web app.
//
// This is the Next.js custom App entrypoint. It wraps every page with global
// providers and initializes critical cross-cutting concerns:
//   - NextAuth SessionProvider for authentication state across all pages
//   - WebPushProvider for browser push notification subscriptions
//   - CacheProvider (react-inlinesvg) to deduplicate inline SVG requests
//   - tRPC integration via `trpc.withTRPC()` enabling type-safe API calls
//     from any component in the tree (see @calcom/trpc/react)
//
// Server-side locale resolution happens in getInitialProps so the correct
// language bundle is available on first render.

import type { IncomingMessage } from "node:http";
import type { NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import React from "react";
import CacheProvider from "react-inlinesvg/provider";

import { WebPushProvider } from "@calcom/features/notifications/WebPushContext";
import { trpc } from "@calcom/trpc/react";

import type { AppProps } from "@lib/app-providers";

import "../styles/globals.css";

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  // Provider ordering matters: SessionProvider must be outermost so auth
  // state is available to WebPushProvider (which may check session) and
  // to all page components. CacheProvider is innermost as it only affects
  // SVG rendering. The PageWrapper pattern allows individual pages to
  // define a layout wrapper (e.g., Shell, SettingsLayout) that receives
  // the full AppProps rather than just pageProps.
  return (
    <SessionProvider session={pageProps.session ?? undefined}>
      <WebPushProvider>
        {/* @ts-expect-error FIXME remove this comment when upgrading typescript to v5 */}
        <CacheProvider>
          {Component.PageWrapper ? <Component.PageWrapper {...props} /> : <Component {...pageProps} />}
        </CacheProvider>
      </WebPushProvider>
    </SessionProvider>
  );
}

declare global {
  interface Window {
    calNewLocale: string;
  }
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const { req } = ctx;

  let newLocale = "en";

  if (req) {
    const { getLocale } = await import("@calcom/features/auth/lib/getLocale");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newLocale = await getLocale(req as IncomingMessage & { cookies: Record<string, any> });
  } else if (typeof window !== "undefined" && window.calNewLocale) {
    newLocale = window.calNewLocale;
  }

  return {
    pageProps: {
      newLocale,
    },
  };
};

// Wrapping the app with tRPC's HOC enables automatic query batching,
// SSR data prefetching, and the tRPC React hooks (useQuery, useMutation)
// throughout the entire component tree. The tRPC client is configured in
// @calcom/trpc/react/trpc.ts and connects to the API handler at
// pages/api/trpc/[trpc].ts.
const WrappedMyApp = trpc.withTRPC(MyApp);

export default WrappedMyApp;
