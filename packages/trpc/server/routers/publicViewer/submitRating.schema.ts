/**
 * @fileoverview Zod schema for booking rating submission
 *
 * This schema validates input for the public rating submission endpoint.
 * It enforces strict validation rules to ensure data integrity and security.
 *
 * ## Security Considerations
 *
 * - **UUID validation**: The bookingUid must be a valid UUID v4 format.
 *   This is critical for security as it makes booking IDs computationally
 *   infeasible to guess (2^122 possible values vs sequential integers).
 *
 * - **Rating bounds**: Ratings are constrained to integers 1-5 to prevent
 *   invalid data and potential abuse (e.g., negative ratings, extreme values).
 *
 * - **Comment length**: Comments are limited to 500 characters to prevent
 *   abuse and ensure reasonable storage requirements.
 *
 * @module submitRating.schema
 */

import { z } from "zod";

/**
 * TypeScript type for rating submission input.
 * This type is used for compile-time type checking throughout the codebase.
 */
export type TSubmitRatingInputSchema = {
  /** UUID of the booking to rate (must be valid UUID v4 format) */
  bookingUid: string;
  /** Rating value from 1 (worst) to 5 (best) */
  rating: number;
  /** Optional feedback comment (max 500 characters) */
  comment?: string;
};

/**
 * Zod validation schema for rating submission.
 *
 * Validation rules:
 * - `bookingUid`: Must be a valid UUID string (prevents enumeration attacks)
 * - `rating`: Must be an integer between 1 and 5 inclusive
 * - `comment`: Optional string with maximum 500 characters
 *
 * @example
 * // Valid input
 * ZSubmitRatingInputSchema.parse({
 *   bookingUid: "550e8400-e29b-41d4-a716-446655440000",
 *   rating: 5,
 *   comment: "Great meeting!"
 * });
 *
 * @example
 * // Invalid - will throw ZodError
 * ZSubmitRatingInputSchema.parse({
 *   bookingUid: "invalid-id",  // Not a valid UUID
 *   rating: 10,                // Out of range
 * });
 */
export const ZSubmitRatingInputSchema: z.ZodType<TSubmitRatingInputSchema> = z.object({
  bookingUid: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});
