import type { TFunction } from "i18next";
import { describe, it, expect } from "vitest";

import {
  defaultLocations,
  DefaultEventLocationTypeEnum,
  getEventLocationType,
  getLocationFromApp,
  guessEventLocationType,
  privacyFilteredLocations,
  getMessageForOrganizer,
  getHumanReadableLocationValue,
  locationKeyToString,
  getEventLocationWithType,
  getLocationValueForDB,
  getEventLocationValue,
  getSuccessPageLocationMessage,
  getTranslatedLocation,
  getOrganizerInputLocationTypes,
  isAttendeeInputRequired,
  DailyLocationType,
  OrganizerDefaultConferencingAppType,
  CalVideoLocationType,
  type LocationObject,
} from "./locations";

const t = ((key: string) => key) as TFunction;

describe("defaultLocations", () => {
  it("contains all default location types", () => {
    expect(defaultLocations.length).toBe(7);
    const types = defaultLocations.map((l) => l.type);
    expect(types).toContain(DefaultEventLocationTypeEnum.AttendeeInPerson);
    expect(types).toContain(DefaultEventLocationTypeEnum.InPerson);
    expect(types).toContain(DefaultEventLocationTypeEnum.Phone);
    expect(types).toContain(DefaultEventLocationTypeEnum.UserPhone);
    expect(types).toContain(DefaultEventLocationTypeEnum.Link);
    expect(types).toContain(DefaultEventLocationTypeEnum.Conferencing);
    expect(types).toContain(DefaultEventLocationTypeEnum.SomewhereElse);
  });
});

describe("constants", () => {
  it("CalVideoLocationType equals DailyLocationType", () => {
    expect(CalVideoLocationType).toBe(DailyLocationType);
  });

  it("OrganizerDefaultConferencingAppType is conferencing", () => {
    expect(OrganizerDefaultConferencingAppType).toBe("conferencing");
  });
});

describe("getEventLocationType", () => {
  it("returns default location type for known type", () => {
    const result = getEventLocationType(DefaultEventLocationTypeEnum.Phone);
    expect(result).toBeDefined();
    expect(result?.type).toBe(DefaultEventLocationTypeEnum.Phone);
  });

  it("returns undefined for unknown type", () => {
    expect(getEventLocationType("unknown_type")).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(getEventLocationType(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(getEventLocationType(undefined)).toBeUndefined();
  });
});

describe("getLocationFromApp", () => {
  it("returns undefined for non-app location", () => {
    expect(getLocationFromApp("phone")).toBeUndefined();
  });

  it("returns app location for known app type", () => {
    const result = getLocationFromApp(DailyLocationType);
    if (result) {
      expect(result.type).toBe(DailyLocationType);
    }
  });
});

describe("guessEventLocationType", () => {
  it("returns location type for known type", () => {
    const result = guessEventLocationType(DefaultEventLocationTypeEnum.Phone);
    expect(result).toBeDefined();
    expect(result?.type).toBe(DefaultEventLocationTypeEnum.Phone);
  });

  it("returns undefined for unknown value", () => {
    expect(guessEventLocationType("totally_unknown")).toBeUndefined();
  });

  it("returns null for null input", () => {
    expect(guessEventLocationType(null)).toBeNull();
  });
});

describe("privacyFilteredLocations", () => {
  it("returns locations with public display intact", () => {
    const locations: LocationObject[] = [
      { type: DefaultEventLocationTypeEnum.InPerson, address: "123 Main St", displayLocationPublicly: true },
    ];
    const result = privacyFilteredLocations(locations);
    expect(result[0].address).toBe("123 Main St");
  });

  it("filters private address when not displayed publicly", () => {
    const locations: LocationObject[] = [
      { type: DefaultEventLocationTypeEnum.InPerson, address: "123 Main St", displayLocationPublicly: false },
    ];
    const result = privacyFilteredLocations(locations);
    expect(result[0].address).toBeUndefined();
  });

  it("keeps unknown location types as-is", () => {
    const locations: LocationObject[] = [{ type: "unknown_custom_type", address: "test" }];
    const result = privacyFilteredLocations(locations);
    expect(result[0].address).toBe("test");
  });
});

describe("getMessageForOrganizer", () => {
  it("returns translated message for default location", () => {
    const result = getMessageForOrganizer(DefaultEventLocationTypeEnum.Phone, t);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty string for unknown location", () => {
    expect(getMessageForOrganizer("totally_unknown", t)).toBe("");
  });
});

describe("getHumanReadableLocationValue", () => {
  it("returns no_location for null", () => {
    expect(getHumanReadableLocationValue(null, t)).toBe("no_location");
  });

  it("returns no_location for undefined", () => {
    expect(getHumanReadableLocationValue(undefined, t)).toBe("no_location");
  });

  it("returns label for known default location type", () => {
    const result = getHumanReadableLocationValue(DefaultEventLocationTypeEnum.Phone, t);
    expect(typeof result).toBe("string");
  });

  it("returns the value itself for unknown types", () => {
    expect(getHumanReadableLocationValue("Some Random Address", t)).toBe("Some Random Address");
  });
});

describe("locationKeyToString", () => {
  it("returns null for unknown location type", () => {
    const location: LocationObject = { type: "unknown_type_xyz" };
    expect(locationKeyToString(location)).toBeNull();
  });

  it("returns label or value for known location type", () => {
    const location: LocationObject = {
      type: DefaultEventLocationTypeEnum.InPerson,
      address: "123 Main St",
    };
    const result = locationKeyToString(location);
    expect(typeof result).toBe("string");
  });
});

describe("getEventLocationWithType", () => {
  it("finds location by type", () => {
    const locations: LocationObject[] = [
      { type: "typeA", address: "A" },
      { type: "typeB", address: "B" },
    ];
    const result = getEventLocationWithType(locations, "typeB");
    expect(result?.address).toBe("B");
  });

  it("returns undefined when type not found", () => {
    const locations: LocationObject[] = [{ type: "typeA" }];
    expect(getEventLocationWithType(locations, "typeC")).toBeUndefined();
  });
});

describe("getLocationValueForDB", () => {
  it("returns default location for empty booking location", () => {
    const result = getLocationValueForDB("  ", []);
    expect(result.bookingLocation).toBe(DailyLocationType);
  });

  it("returns the type when no matching event location found", () => {
    const result = getLocationValueForDB("some-type", []);
    expect(result.bookingLocation).toBe("some-type");
  });

  it("resolves value from event location for known static type", () => {
    const locations: LocationObject[] = [
      {
        type: DefaultEventLocationTypeEnum.InPerson,
        address: "123 Main St",
      },
    ];
    const result = getLocationValueForDB(DefaultEventLocationTypeEnum.InPerson, locations);
    expect(result.bookingLocation).toBe("123 Main St");
  });
});

describe("getEventLocationValue", () => {
  it("returns empty string for unknown type", () => {
    const result = getEventLocationValue([], { type: "unknown" });
    expect(result).toBe("");
  });
});

describe("getSuccessPageLocationMessage", () => {
  it("returns location as-is for default location types", () => {
    const result = getSuccessPageLocationMessage(DefaultEventLocationTypeEnum.Phone, t);
    expect(result).toBe(DefaultEventLocationTypeEnum.Phone);
  });

  it("returns location for unknown types", () => {
    const result = getSuccessPageLocationMessage("some_random_location", t);
    expect(result).toBe("some_random_location");
  });
});

describe("getTranslatedLocation", () => {
  it("returns null when eventLocationType is undefined", () => {
    const location: LocationObject = { type: "unknown" };
    expect(getTranslatedLocation(location, undefined, t)).toBeNull();
  });

  it("returns label for integration location", () => {
    const location: LocationObject = { type: "integrations:daily" };
    const eventLocationType = getEventLocationType("integrations:daily");
    if (eventLocationType) {
      const result = getTranslatedLocation(location, eventLocationType, t);
      expect(result).toBe(eventLocationType.label);
    }
  });
});

describe("getOrganizerInputLocationTypes", () => {
  it("returns array of location types with organizer input", () => {
    const result = getOrganizerInputLocationTypes();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("isAttendeeInputRequired", () => {
  it("returns attendee input type for phone location", () => {
    const result = isAttendeeInputRequired(DefaultEventLocationTypeEnum.Phone);
    expect(result).toBe("phone");
  });

  it("returns false for unknown location type", () => {
    expect(isAttendeeInputRequired("unknown_xyz")).toBe(false);
  });

  it("returns falsy for location without attendee input", () => {
    const result = isAttendeeInputRequired(DefaultEventLocationTypeEnum.InPerson);
    expect(result).toBeFalsy();
  });
});
