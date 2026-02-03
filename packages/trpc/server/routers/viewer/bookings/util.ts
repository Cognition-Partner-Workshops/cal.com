import { prisma } from "@calcom/prisma";
import type {
  Booking,
  EventType,
  BookingReference,
  Attendee,
  DestinationCalendar,
  User,
} from "@calcom/prisma/client";
import { MembershipRole, SchedulingType } from "@calcom/prisma/enums";
import { safeCredentialSelect } from "@calcom/prisma/selects/credential";

import { TRPCError } from "@trpc/server";

import authedProcedure from "../../../procedures/authedProcedure";
import { commonBookingSchema } from "./types";

// Type for safe credential without the sensitive 'key' field
type SafeCredential = {
  id: number;
  type: string;
  userId: number | null;
  user: { email: string } | null;
  teamId: number | null;
  appId: string | null;
  invalid: boolean | null;
  delegationCredentialId: string | null;
};

export const bookingsProcedure = authedProcedure
  .input(commonBookingSchema)
  .use(async ({ ctx, input, next }) => {
    // Endpoints that just read the logged in user's data - like 'list' don't necessary have any input
    const { bookingId } = input;
    const loggedInUser = ctx.user;
    const bookingInclude = {
      attendees: true,
      eventType: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
              parentId: true,
            },
          },
        },
      },
      destinationCalendar: true,
      references: true,
      user: {
        include: {
          destinationCalendar: true,
          // Use safeCredentialSelect to avoid exposing sensitive credential.key field
          credentials: {
            select: safeCredentialSelect,
          },
          profiles: {
            select: {
              organizationId: true,
            },
          },
        },
      },
    };

    const bookingByBeingAdmin = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        eventType: {
          team: {
            members: {
              some: {
                userId: loggedInUser.id,
                role: {
                  in: [MembershipRole.ADMIN, MembershipRole.OWNER],
                },
              },
            },
          },
        },
      },
      include: bookingInclude,
    });

    if (!!bookingByBeingAdmin) {
      return next({ ctx: { booking: bookingByBeingAdmin } });
    }

    const bookingByBeingOrganizerOrCollectiveEventMember = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        AND: [
          {
            OR: [
              /* If user is organizer */
              { userId: ctx.user.id },
              /* Or part of a collective booking */
              {
                eventType: {
                  schedulingType: SchedulingType.COLLECTIVE,
                  users: {
                    some: {
                      id: ctx.user.id,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: bookingInclude,
    });

    if (!bookingByBeingOrganizerOrCollectiveEventMember) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({ ctx: { booking: bookingByBeingOrganizerOrCollectiveEventMember } });
  });

export type BookingsProcedureContext = {
  booking: Booking & {
    eventType:
      | (EventType & {
          team?: { id: number; name: string; parentId?: number | null } | null;
        })
      | null;
    destinationCalendar: DestinationCalendar | null;
    user:
      | (User & {
          destinationCalendar: DestinationCalendar | null;
          // Using SafeCredential type to ensure sensitive 'key' field is not exposed
          credentials: SafeCredential[];
          profiles: { organizationId: number }[];
        })
      | null;
    references: BookingReference[];
    attendees: Attendee[];
  };
};
