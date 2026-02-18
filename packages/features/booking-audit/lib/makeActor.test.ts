import { describe, expect, it } from "vitest";

import {
  buildActorEmail,
  makeActorById,
  makeAppActor,
  makeAppActorUsingSlug,
  makeAttendeeActor,
  makeGuestActor,
  makeSystemActor,
  makeUserActor,
} from "./makeActor";

describe("makeActor utilities", () => {
  describe("makeUserActor", () => {
    it("creates a user actor with correct identifiedBy and userUuid", () => {
      const actor = makeUserActor("uuid-123");
      expect(actor).toEqual({ identifiedBy: "user", userUuid: "uuid-123" });
    });
  });

  describe("makeGuestActor", () => {
    it("creates a guest actor with email and name", () => {
      const actor = makeGuestActor({ email: "guest@example.com", name: "Guest" });
      expect(actor).toEqual({ identifiedBy: "guest", email: "guest@example.com", name: "Guest" });
    });

    it("handles null name", () => {
      const actor = makeGuestActor({ email: "guest@example.com", name: null });
      expect(actor.name).toBeNull();
    });
  });

  describe("makeSystemActor", () => {
    it("creates a system actor with the reserved system UUID", () => {
      const actor = makeSystemActor();
      expect(actor).toEqual({ identifiedBy: "id", id: "00000000-0000-0000-0000-000000000000" });
    });
  });

  describe("makeActorById", () => {
    it("creates an actor by ID", () => {
      const actor = makeActorById("custom-id-456");
      expect(actor).toEqual({ identifiedBy: "id", id: "custom-id-456" });
    });
  });

  describe("makeAttendeeActor", () => {
    it("creates an attendee actor with attendeeId", () => {
      const actor = makeAttendeeActor(42);
      expect(actor).toEqual({ identifiedBy: "attendee", attendeeId: 42 });
    });
  });

  describe("makeAppActor", () => {
    it("creates an app actor by credential ID", () => {
      const actor = makeAppActor({ credentialId: 99 });
      expect(actor).toEqual({ identifiedBy: "app", credentialId: 99 });
    });
  });

  describe("makeAppActorUsingSlug", () => {
    it("creates an app actor by slug and name", () => {
      const actor = makeAppActorUsingSlug({ appSlug: "stripe", name: "Stripe" });
      expect(actor).toEqual({ identifiedBy: "appSlug", appSlug: "stripe", name: "Stripe" });
    });
  });

  describe("buildActorEmail", () => {
    it("builds a system actor email", () => {
      expect(buildActorEmail({ identifier: "system", actorType: "system" })).toBe("system@system.internal");
    });

    it("builds a guest actor email", () => {
      expect(buildActorEmail({ identifier: "john", actorType: "guest" })).toBe("john@guest.internal");
    });

    it("builds an app actor email", () => {
      expect(buildActorEmail({ identifier: "stripe", actorType: "app" })).toBe("stripe@app.internal");
    });
  });
});
