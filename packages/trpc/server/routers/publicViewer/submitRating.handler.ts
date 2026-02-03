/**
 * @fileoverview Handler for submitting booking ratings
 *
 * This handler allows attendees to rate their booking experience after
 * the meeting has concluded. It is exposed as a public endpoint (no auth required)
 * since attendees may not have Cal.com accounts.
 *
 * ## Security Model
 *
 * Since this is a public endpoint, security relies on:
 * 1. **UUID validation**: The bookingUid must be a valid UUID format, making it
 *    computationally infeasible to guess valid booking IDs
 * 2. **State validation**: Multiple checks ensure the booking is in a valid state
 *    for rating (exists, completed, ended, not already rated)
 *
 * ## Error Codes
 *
 * - `NOT_FOUND`: The booking with the given UID does not exist
 * - `BAD_REQUEST`: The booking exists but cannot be rated due to:
 *   - Booking is not in ACCEPTED status (cancelled, pending, etc.)
 *   - Booking has not yet ended (meeting still in progress or future)
 *   - Booking has already been rated (prevents rating manipulation)
 *
 * @module submitRating.handler
 */

import { TRPCError } from "@trpc/server";

import { prisma } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import type { TSubmitRatingInputSchema } from "./submitRating.schema";

/**
 * Options for the submitRating handler
 */
type SubmitRatingOptions = {
  /** The validated input from the request */
  input: TSubmitRatingInputSchema;
};

/**
 * Handles the submission of a rating for a completed booking.
 *
 * This handler performs comprehensive validation before allowing a rating:
 * 1. Verifies the booking exists in the database
 * 2. Confirms the booking has ACCEPTED status (completed successfully)
 * 3. Ensures the booking's end time has passed
 * 4. Checks that no rating has been previously submitted
 *
 * @param options - The handler options containing validated input
 * @param options.input - The rating submission data (bookingUid, rating, optional comment)
 *
 * @throws {TRPCError} NOT_FOUND - When booking doesn't exist
 * @throws {TRPCError} BAD_REQUEST - When booking state doesn't allow rating
 *
 * @example
 * // Successful rating submission
 * await submitRatingHandler({
 *   input: {
 *     bookingUid: "550e8400-e29b-41d4-a716-446655440000",
 *     rating: 5,
 *     comment: "Great meeting!"
 *   }
 * });
 */
export async function submitRatingHandler({ input }: SubmitRatingOptions): Promise<void> {
  const { bookingUid, rating, comment } = input;

  // Fetch booking with only the fields needed for validation
  // Using select instead of include for security (principle of least privilege)
  const booking = await prisma.booking.findUnique({
    where: {
      uid: bookingUid,
    },
    select: {
      id: true,
      status: true,
      endTime: true,
      rating: true,
    },
  });

  // Security check 1: Verify booking exists
  // This prevents information disclosure about valid booking IDs
  if (!booking) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Booking not found",
    });
  }

  // Security check 2: Verify booking was completed successfully
  // Only ACCEPTED bookings should be ratable (not cancelled, pending, etc.)
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only rate completed bookings",
    });
  }

  // Security check 3: Verify the meeting has ended
  // Prevents rating manipulation before the actual meeting occurs
  if (new Date(booking.endTime) > new Date()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only rate bookings after they have ended",
    });
  }

  // Security check 4: Prevent re-rating
  // This prevents rating manipulation by repeatedly submitting ratings
  // Note: If re-rating should be allowed, remove this check
  if (booking.rating !== null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Booking has already been rated",
    });
  }

  // All validations passed - persist the rating
  await prisma.booking.update({
    where: {
      uid: bookingUid,
    },
    data: {
      rating: rating,
      ratingFeedback: comment,
    },
  });
}

export default submitRatingHandler;
