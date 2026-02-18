import { describe, expect, it } from "vitest";

import { ActorSchema, BookingAuditContextSchema, PiiFreeActorSchema } from "./types";

describe("ActorSchema", () => {
  it("parses a user actor", () => {
    const result = ActorSchema.parse({ identifiedBy: "user", userUuid: "uuid-1" });
    expect(result).toEqual({ identifiedBy: "user", userUuid: "uuid-1" });
  });

  it("parses an attendee actor", () => {
    const result = ActorSchema.parse({ identifiedBy: "attendee", attendeeId: 5 });
    expect(result).toEqual({ identifiedBy: "attendee", attendeeId: 5 });
  });

  it("parses an id-based actor", () => {
    const result = ActorSchema.parse({ identifiedBy: "id", id: "some-id" });
    expect(result).toEqual({ identifiedBy: "id", id: "some-id" });
  });

  it("parses a guest actor", () => {
    const result = ActorSchema.parse({ identifiedBy: "guest", email: "g@test.com", name: "Guest" });
    expect(result).toEqual({ identifiedBy: "guest", email: "g@test.com", name: "Guest" });
  });

  it("parses a guest actor with null name", () => {
    const result = ActorSchema.parse({ identifiedBy: "guest", email: "g@test.com", name: null });
    expect(result.name).toBeNull();
  });

  it("parses an app actor by credential ID", () => {
    const result = ActorSchema.parse({ identifiedBy: "app", credentialId: 10 });
    expect(result).toEqual({ identifiedBy: "app", credentialId: 10 });
  });

  it("parses an app actor by slug", () => {
    const result = ActorSchema.parse({ identifiedBy: "appSlug", appSlug: "stripe", name: "Stripe" });
    expect(result).toEqual({ identifiedBy: "appSlug", appSlug: "stripe", name: "Stripe" });
  });

  it("rejects an unknown identifiedBy", () => {
    expect(() => ActorSchema.parse({ identifiedBy: "unknown" })).toThrow();
  });
});

describe("PiiFreeActorSchema", () => {
  it("parses id, user, and attendee actors", () => {
    expect(PiiFreeActorSchema.parse({ identifiedBy: "id", id: "x" })).toBeDefined();
    expect(PiiFreeActorSchema.parse({ identifiedBy: "user", userUuid: "u" })).toBeDefined();
    expect(PiiFreeActorSchema.parse({ identifiedBy: "attendee", attendeeId: 1 })).toBeDefined();
  });

  it("rejects guest actors (contains PII)", () => {
    expect(() =>
      PiiFreeActorSchema.parse({ identifiedBy: "guest", email: "g@test.com", name: "G" })
    ).toThrow();
  });
});

describe("BookingAuditContextSchema", () => {
  it("parses context with impersonatedBy", () => {
    const result = BookingAuditContextSchema.parse({ impersonatedBy: "admin-uuid" });
    expect(result.impersonatedBy).toBe("admin-uuid");
  });

  it("parses context without impersonatedBy", () => {
    const result = BookingAuditContextSchema.parse({});
    expect(result.impersonatedBy).toBeUndefined();
  });

  it("parses empty context object", () => {
    const result = BookingAuditContextSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
