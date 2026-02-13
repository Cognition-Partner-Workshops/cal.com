/**
 * _app.ts — Root router for the Cal.com tRPC backend.
 *
 * This is the top-level router that aggregates all sub-routers. It defines a
 * single `viewer` namespace which contains all authenticated and public
 * procedures (see viewer/_router.tsx for the full composition).
 *
 * The exported `AppRouter` type is critical — it's used by the React client
 * (@calcom/trpc/react) to provide end-to-end type inference. Any changes to
 * router structure here are automatically reflected in client-side hook types.
 *
 * Usage:
 *   - Web app API handler: createNextApiHandler(appRouter) in pages/api/trpc/[trpc].ts
 *   - Server-side caller: createCallerFactory(appRouter)(context)
 *   - SSG prefetching: createServerSideHelpers with appRouter
 *
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
import { router } from "../trpc";
import { viewerRouter } from "./viewer/_router";

export const appRouter = router({
  viewer: viewerRouter,
});

export type AppRouter = typeof appRouter;
