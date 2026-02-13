// createContext.ts — Builds the tRPC context available to every procedure.
//
// Two layers of context:
//
//   1. Inner context (createContextInner): Always available, even in tests and
//      SSG where there is no HTTP request. Provides prisma, insightsDb (read
//      replica), session, locale, sourceIp, and traceContext.
//
//   2. Outer context (createContext): Wraps inner context with req/res from
//      Next.js. Resolves the locale from the request and optionally fetches
//      the session via a pluggable sessionGetter (NextAuth's getServerSession).
//
// Usage:
//   - API handler: createContext(opts) is called by createNextApiHandler
//   - Testing: createContextInner({ locale: "en", session }) bypasses HTTP
//   - SSG helpers: createContextInner() for build-time data fetching
//
// Exported types (TRPCContext, WithSession, WithLocale) are used by middleware
// to narrow the context type after authentication checks.

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import type { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import getIP from "@calcom/lib/getIP";
import type { TraceContext } from "@calcom/lib/tracing";
import { distributedTracing } from "@calcom/lib/tracing/factory";
import { prisma, readonlyPrisma } from "@calcom/prisma";
import type { SelectedCalendar, User as PrismaUser } from "@calcom/prisma/client";

import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

type CreateContextOptions =
  | (Omit<CreateNextContextOptions, "info"> & {
      info?: CreateNextContextOptions["info"];
    })
  | GetServerSidePropsContext;

export type CreateInnerContextOptions = {
  sourceIp?: string;
  session?: Session | null;
  locale: string;
  user?:
    | Omit<
        PrismaUser,
        | "locale"
        | "twoFactorSecret"
        | "emailVerified"
        | "password"
        | "identityProviderId"
        | "invitedTo"
        | "allowDynamicBooking"
        | "verified"
      > & {
        locale: Exclude<PrismaUser["locale"], null>;
        credentials?: Credential[];
        selectedCalendars?: Partial<SelectedCalendar>[];
        rawAvatar?: string;
      };
  i18n?: Awaited<ReturnType<typeof serverSideTranslations>>;
} & Partial<CreateContextOptions>;

export type GetSessionFn =
  | ((_options: {
      req: GetServerSidePropsContext["req"] | NextApiRequest;
      res: GetServerSidePropsContext["res"] | NextApiResponse;
    }) => Promise<Session | null>)
  | (() => Promise<Session | null>);

export type InnerContext = CreateInnerContextOptions & {
  prisma: typeof prisma;
  insightsDb: typeof readonlyPrisma;
  traceContext: TraceContext;
};

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts: CreateInnerContextOptions): Promise<InnerContext> {
  const traceContext = distributedTracing.createTrace("trpc_request", {
    meta: {
      userId: opts.session?.user?.id?.toString() || "anonymous",
    },
  });

  return {
    prisma,
    insightsDb: readonlyPrisma,
    ...opts,
    traceContext,
  };
}

type Context = InnerContext & {
  req: CreateContextOptions["req"];
  res: CreateContextOptions["res"];
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  { req, res }: CreateContextOptions,
  sessionGetter?: GetSessionFn
): Promise<Context> => {
  const locale = await getLocale(req);

  // This type may not be accurate if this request is coming from SSG init but they both should satisfy the requirements of getIP.
  // TODO: @sean - figure out a way to make getIP be happy with trpc req. params
  const sourceIp = getIP(req as NextApiRequest);
  const session = sessionGetter ? await sessionGetter({ req, res }) : null;
  const contextInner = await createContextInner({ locale, session, sourceIp });
  return {
    ...contextInner,
    req,
    res,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createContext>>;
export type TRPCContextInner = Awaited<ReturnType<typeof createContextInner>>;
export type WithLocale<T extends TRPCContext = any> = T &
  Required<Pick<CreateInnerContextOptions, "i18n" | "locale">>;
export type WithSession<T extends TRPCContext = any> = T &
  Required<Pick<CreateInnerContextOptions, "session">>;
