/**
 * @fileoverview Zod schema for marking a host as no-show
 *
 * This schema validates input for the public endpoint that allows attendees
 * to report when a host fails to show up for a scheduled meeting.
 *
 * ## Security Considerations
 *
 * - **UUID validation**: The bookingUid must be a valid UUID v4 format.
 *   This prevents enumeration attacks where malicious actors could iterate
 *   through sequential IDs to find valid bookings.
 *
 * ## Usage Context
 *
 * This is a public endpoint (no authentication required) because:
 * - Attendees may not have Cal.com accounts
 * - The booking link contains the UUID which serves as a capability token
 * - Additional validation in the handler ensures the booking is in a valid state
 *
 * @module markHostAsNoShow.schema
 */

import { z } from "zod";

/**
 * TypeScript type for no-show reporting input.
 * This type is used for compile-time type checking throughout the codebase.
 */
export type TNoShowInputSchema = {
  /** UUID of the booking where the host didn't show up */
  bookingUid: string;
  /** Whether to mark the host as no-show (true) or clear the no-show status (false) */
  noShowHost: boolean;
};

/**
 * Zod validation schema for no-show reporting.
 *
 * Validation rules:
 * - `bookingUid`: Must be a valid UUID string (prevents enumeration attacks)
 * - `noShowHost`: Boolean flag indicating no-show status
 *
 * @example
 * // Valid input - marking host as no-show
 * ZMarkHostAsNoShowInputSchema.parse({
 *   bookingUid: "550e8400-e29b-41d4-a716-446655440000",
 *   noShowHost: true
 * });
 */
export const ZMarkHostAsNoShowInputSchema: z.ZodType<TNoShowInputSchema> = z.object({
  bookingUid: z.string().uuid(),
  noShowHost: z.boolean(),
});
