/**
 * @fileoverview Zod schema for finding bookings by UID
 *
 * This schema validates input for the booking lookup endpoint.
 * It is used to find a specific booking by its unique identifier.
 *
 * ## Security Considerations
 *
 * - **UUID validation**: When provided, the bookingUid must be a valid UUID v4 format.
 *   This prevents enumeration attacks and ensures only properly formatted
 *   identifiers are accepted.
 *
 * - **Optional field**: The bookingUid is optional to support different lookup
 *   scenarios (e.g., listing all bookings vs finding a specific one).
 *
 * @module find.schema
 */

import { z } from "zod";

/**
 * TypeScript type for booking find input.
 * This type is used for compile-time type checking throughout the codebase.
 */
export type TFindInputSchema = {
  /** Optional UUID of the booking to find (must be valid UUID v4 format if provided) */
  bookingUid?: string;
};

/**
 * Zod validation schema for booking lookup.
 *
 * Validation rules:
 * - `bookingUid`: Optional, but if provided must be a valid UUID string
 *
 * @example
 * // Valid input - finding specific booking
 * ZFindInputSchema.parse({
 *   bookingUid: "550e8400-e29b-41d4-a716-446655440000"
 * });
 *
 * @example
 * // Valid input - no specific booking (list all)
 * ZFindInputSchema.parse({});
 */
export const ZFindInputSchema: z.ZodType<TFindInputSchema> = z.object({
  bookingUid: z.string().uuid().optional(),
});
