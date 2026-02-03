import process from "node:process";

import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextMiddleware } from "next-api-middleware";

/**
 * Get the allowed CORS origin based on the request origin and environment configuration.
 * Falls back to the request origin if it matches allowed patterns, otherwise returns undefined.
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

export const addRequestId: NextMiddleware = async (
  _req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
): Promise<void> => {
  // Apply header with unique ID to every request
  res.setHeader("Calcom-Response-ID", nanoid());
  // Add all headers here instead of next.config.js as it is throwing error( Cannot set headers after they are sent to the client) for OPTIONS method
  // It is known to happen only in Dev Mode.
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Set CORS origin based on request origin and allowed origins configuration
  const requestOrigin = _req.headers.origin as string | undefined;
  const allowedOrigin = getAllowedOrigin(requestOrigin);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH, DELETE, POST, PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type, api_key, Authorization"
  );

  // Ensure all OPTIONS request are automatically successful. Headers are already set above.
  if (_req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  // Let remaining middleware and API route execute
  await next();
};
