// trpc.ts — Core tRPC initialization for the Cal.com server.
//
// This file creates the tRPC instance that all routers and procedures are built
// from. It configures:
//   - superjson transformer: Automatically serializes/deserializes Date, Map,
//     Set, BigInt, and other non-JSON-safe types across the wire.
//   - errorFormatter: Normalizes error responses into a consistent shape
//     (see errorFormatter.ts).
//   - Context type: Uses createContextInner's return type, which provides
//     prisma, insightsDb, session, locale, and traceContext to every procedure.
//
// Exports are used throughout the routers/ directory to define routers,
// compose middleware, and build procedures.

import superjson from "superjson";

import { initTRPC } from "@trpc/server";

import type { createContextInner } from "./createContext";
import { errorFormatter } from "./errorFormatter";

export const tRPCContext = initTRPC.context<typeof createContextInner>().create({
  transformer: superjson,
  errorFormatter,
});

export const router = tRPCContext.router;
export const mergeRouters = tRPCContext.mergeRouters;
export const middleware = tRPCContext.middleware;
export const procedure = tRPCContext.procedure;
export const createCallerFactory = tRPCContext.createCallerFactory;
