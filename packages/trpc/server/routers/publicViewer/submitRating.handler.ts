import { TRPCError } from "@trpc/server";

import { prisma } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

import type { TSubmitRatingInputSchema } from "./submitRating.schema";

type SubmitRatingOptions = {
  input: TSubmitRatingInputSchema;
};

export async function submitRatingHandler({ input }: SubmitRatingOptions): Promise<void> {
  const { bookingUid, rating, comment } = input;

  // First, verify the booking exists and is in a valid state for rating
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

  if (!booking) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Booking not found",
    });
  }

  // Only allow rating for accepted/completed bookings
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only rate completed bookings",
    });
  }

  // Only allow rating after the booking has ended
  if (new Date(booking.endTime) > new Date()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Can only rate bookings after they have ended",
    });
  }

  // Prevent re-rating if already rated (optional - can be removed if re-rating should be allowed)
  if (booking.rating !== null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Booking has already been rated",
    });
  }

  await prisma.booking.update({
    where: {
      uid: bookingUid,
    },
    data: {
      rating: rating,
      ratingFeedback: comment,
    },
  });
};

export default submitRatingHandler;
