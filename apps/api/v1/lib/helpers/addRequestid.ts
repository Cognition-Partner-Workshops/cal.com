/**
 * @fileoverview CORS and Request ID Middleware for Cal.com API v1
 *
 * This middleware handles two critical functions:
 * 1. Assigns a unique request ID to each API request for tracing and debugging
 * 2. Implements secure CORS (Cross-Origin Resource Sharing) policy
 *
 * ## Security Considerations
 *
 * The CORS implementation follows the principle of least privilege:
 * - Origins must be explicitly allowlisted via environment variables
 * - Wildcard origins (*) are NOT supported to prevent CSRF-like attacks
 * - Development mode allows localhost for convenience
 *
 * ## Environment Variables
 *
 * - `API_CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins
 *   Example: "https://app.cal.com,https://staging.cal.com"
 * - `NEXT_PUBLIC_WEBAPP_URL`: The main webapp URL, always allowed as fallback
 * - `NODE_ENV`: When set to "development", localhost origins are permitted
 *
 * @module addRequestId
 */

import process from "node:process";

import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextMiddleware } from "next-api-middleware";

/**
 * Determines if a request origin is allowed based on environment configuration.
 *
 * The function checks origins in the following priority order:
 * 1. Explicit allowlist from `API_CORS_ALLOWED_ORIGINS` env var
 * 2. The webapp URL from `NEXT_PUBLIC_WEBAPP_URL` env var
 * 3. Localhost origins (development mode only)
 *
 * @param requestOrigin - The Origin header from the incoming request
 * @returns The allowed origin string if permitted, undefined otherwise
 *
 * @example
 * // With API_CORS_ALLOWED_ORIGINS="https://app.cal.com,https://staging.cal.com"
 * getAllowedOrigin("https://app.cal.com") // Returns "https://app.cal.com"
 * getAllowedOrigin("https://malicious.com") // Returns undefined
 */
function getAllowedOrigin(requestOrigin: string | undefined): string | undefined {
  // If no origin header, this is likely a same-origin request or server-to-server
  if (!requestOrigin) {
    return undefined;
  }

  // Get allowed origins from environment variable (comma-separated list)
  // If not set, allow the webapp URL as default
  const allowedOriginsEnv = process.env.API_CORS_ALLOWED_ORIGINS;
  const webappUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;

  if (allowedOriginsEnv) {
    const allowedOrigins = allowedOriginsEnv.split(",").map((origin: string) => origin.trim());
    if (allowedOrigins.includes(requestOrigin)) {
      return requestOrigin;
    }
  }

  // Always allow the webapp URL
  if (webappUrl && requestOrigin === webappUrl) {
    return requestOrigin;
  }

  // In development, allow localhost origins
  if (process.env.NODE_ENV === "development" && requestOrigin.includes("localhost")) {
    return requestOrigin;
  }

  return undefined;
}

/**
 * Next.js API middleware that adds request tracking and CORS headers.
 *
 * This middleware performs the following operations:
 * 1. Generates and attaches a unique request ID via `Calcom-Response-ID` header
 * 2. Sets CORS headers based on the configured allowed origins
 * 3. Handles preflight OPTIONS requests automatically
 *
 * ## Request ID
 * Each request receives a unique nanoid-generated identifier that can be used
 * for request tracing, debugging, and correlating logs across services.
 *
 * ## CORS Behavior
 * - The `Access-Control-Allow-Origin` header is only set if the request origin
 *   is in the allowed list (see `getAllowedOrigin` function)
 * - Credentials are always allowed (`Access-Control-Allow-Credentials: true`)
 * - Standard HTTP methods and common headers are permitted
 *
 * @param _req - The incoming Next.js API request
 * @param res - The Next.js API response object
 * @param next - Callback to continue to the next middleware/handler
 *
 * @example
 * // Usage in API route middleware chain
 * import { addRequestId } from "./helpers/addRequestid";
 * export default use(addRequestId, otherMiddleware)(handler);
 */
export const addRequestId: NextMiddleware = async (
  _req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
): Promise<void> => {
  // Generate and attach unique request ID for tracing and debugging
  res.setHeader("Calcom-Response-ID", nanoid());

  // Set CORS headers here instead of next.config.js to avoid
  // "Cannot set headers after they are sent" error on OPTIONS requests in dev mode
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Only set Access-Control-Allow-Origin if the request origin is allowed
  // This prevents CSRF-like attacks from unauthorized origins
  const requestOrigin = _req.headers.origin as string | undefined;
  const allowedOrigin = getAllowedOrigin(requestOrigin);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  // Define allowed HTTP methods for cross-origin requests
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH, DELETE, POST, PUT");

  // Define allowed headers for cross-origin requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type, api_key, Authorization"
  );

  // Handle CORS preflight requests - respond immediately with 200 OK
  // The CORS headers are already set above
  if (_req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Continue to the next middleware or API route handler
  await next();
};
