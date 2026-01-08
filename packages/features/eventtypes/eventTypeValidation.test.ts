import { describe, expect, it } from "vitest";

describe("Event Type Validation Tests", () => {
  describe("Event Type Basic Validation", () => {
    interface EventType {
      title: string;
      slug: string;
      length: number;
      description?: string;
      hidden?: boolean;
      requiresConfirmation?: boolean;
    }

    const isValidEventType = (eventType: EventType): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!eventType.title || eventType.title.trim().length === 0) {
        errors.push("Title is required");
      }

      if (eventType.title && eventType.title.length > 100) {
        errors.push("Title must be 100 characters or less");
      }

      if (!eventType.slug || eventType.slug.trim().length === 0) {
        errors.push("Slug is required");
      }

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (eventType.slug && !slugRegex.test(eventType.slug)) {
        errors.push("Slug must be lowercase alphanumeric with hyphens");
      }

      if (!eventType.length || eventType.length <= 0) {
        errors.push("Duration must be greater than 0");
      }

      if (eventType.length && eventType.length > 1440) {
        errors.push("Duration cannot exceed 24 hours (1440 minutes)");
      }

      if (eventType.description && eventType.description.length > 1000) {
        errors.push("Description must be 1000 characters or less");
      }

      return { valid: errors.length === 0, errors };
    };

    it("should validate correct event type", () => {
      const eventType: EventType = {
        title: "30 Minute Meeting",
        slug: "30-min",
        length: 30,
        description: "A quick 30 minute meeting",
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty title", () => {
      const eventType: EventType = {
        title: "",
        slug: "30-min",
        length: 30,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Title is required");
    });

    it("should reject title exceeding max length", () => {
      const eventType: EventType = {
        title: "A".repeat(101),
        slug: "30-min",
        length: 30,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Title must be 100 characters or less");
    });

    it("should reject invalid slug format", () => {
      const eventType: EventType = {
        title: "Meeting",
        slug: "Invalid Slug!",
        length: 30,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Slug must be lowercase alphanumeric with hyphens");
    });

    it("should reject zero duration", () => {
      const eventType: EventType = {
        title: "Meeting",
        slug: "meeting",
        length: 0,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Duration must be greater than 0");
    });

    it("should reject negative duration", () => {
      const eventType: EventType = {
        title: "Meeting",
        slug: "meeting",
        length: -30,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
    });

    it("should reject duration exceeding 24 hours", () => {
      const eventType: EventType = {
        title: "Meeting",
        slug: "meeting",
        length: 1500,
      };
      const result = isValidEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Duration cannot exceed 24 hours (1440 minutes)");
    });

    it("should accept valid slug formats", () => {
      const validSlugs = ["meeting", "30-min", "quick-call", "team-sync-2024"];
      validSlugs.forEach((slug) => {
        const eventType: EventType = {
          title: "Meeting",
          slug,
          length: 30,
        };
        expect(isValidEventType(eventType).valid).toBe(true);
      });
    });

    it("should reject invalid slug formats", () => {
      const invalidSlugs = ["Meeting", "30_min", "quick call", "team--sync", "-meeting", "meeting-"];
      invalidSlugs.forEach((slug) => {
        const eventType: EventType = {
          title: "Meeting",
          slug,
          length: 30,
        };
        expect(isValidEventType(eventType).valid).toBe(false);
      });
    });
  });

  describe("Event Type Location Validation", () => {
    type LocationType =
      | "inPerson"
      | "link"
      | "phone"
      | "integrations:daily"
      | "integrations:zoom"
      | "integrations:google_meet";

    interface Location {
      type: LocationType;
      address?: string;
      link?: string;
      displayLocationPublicly?: boolean;
    }

    const isValidLocation = (location: Location): { valid: boolean; error?: string } => {
      if (location.type === "inPerson" && !location.address) {
        return { valid: false, error: "Address is required for in-person meetings" };
      }

      if (location.type === "link") {
        if (!location.link) {
          return { valid: false, error: "Link is required for link-based meetings" };
        }
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(location.link)) {
          return { valid: false, error: "Invalid URL format" };
        }
      }

      return { valid: true };
    };

    it("should validate in-person location with address", () => {
      const location: Location = {
        type: "inPerson",
        address: "123 Main St, City, Country",
        displayLocationPublicly: true,
      };
      expect(isValidLocation(location).valid).toBe(true);
    });

    it("should reject in-person location without address", () => {
      const location: Location = {
        type: "inPerson",
      };
      const result = isValidLocation(location);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Address is required");
    });

    it("should validate link location with valid URL", () => {
      const location: Location = {
        type: "link",
        link: "https://meet.example.com/room123",
      };
      expect(isValidLocation(location).valid).toBe(true);
    });

    it("should reject link location without URL", () => {
      const location: Location = {
        type: "link",
      };
      const result = isValidLocation(location);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Link is required");
    });

    it("should reject link location with invalid URL", () => {
      const location: Location = {
        type: "link",
        link: "not-a-valid-url",
      };
      const result = isValidLocation(location);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid URL format");
    });

    it("should validate integration locations", () => {
      const integrationTypes: LocationType[] = [
        "integrations:daily",
        "integrations:zoom",
        "integrations:google_meet",
      ];

      integrationTypes.forEach((type) => {
        const location: Location = { type };
        expect(isValidLocation(location).valid).toBe(true);
      });
    });

    it("should validate phone location", () => {
      const location: Location = {
        type: "phone",
      };
      expect(isValidLocation(location).valid).toBe(true);
    });
  });

  describe("Event Type Scheduling Configuration", () => {
    interface SchedulingConfig {
      minimumBookingNotice: number;
      beforeEventBuffer: number;
      afterEventBuffer: number;
      slotInterval: number | null;
      periodType: "UNLIMITED" | "ROLLING" | "RANGE";
      periodDays?: number;
      periodStartDate?: Date;
      periodEndDate?: Date;
    }

    const isValidSchedulingConfig = (config: SchedulingConfig): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (config.minimumBookingNotice < 0) {
        errors.push("Minimum booking notice cannot be negative");
      }

      if (config.beforeEventBuffer < 0) {
        errors.push("Before event buffer cannot be negative");
      }

      if (config.afterEventBuffer < 0) {
        errors.push("After event buffer cannot be negative");
      }

      if (config.slotInterval !== null && config.slotInterval <= 0) {
        errors.push("Slot interval must be greater than 0");
      }

      if (config.periodType === "ROLLING" && (!config.periodDays || config.periodDays <= 0)) {
        errors.push("Period days must be specified for rolling availability");
      }

      if (config.periodType === "RANGE") {
        if (!config.periodStartDate || !config.periodEndDate) {
          errors.push("Start and end dates must be specified for range availability");
        } else if (config.periodStartDate >= config.periodEndDate) {
          errors.push("End date must be after start date");
        }
      }

      return { valid: errors.length === 0, errors };
    };

    it("should validate correct scheduling config", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "UNLIMITED",
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should reject negative minimum booking notice", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: -60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "UNLIMITED",
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Minimum booking notice cannot be negative");
    });

    it("should reject negative buffer times", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: -15,
        afterEventBuffer: -15,
        slotInterval: 15,
        periodType: "UNLIMITED",
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Before event buffer cannot be negative");
      expect(result.errors).toContain("After event buffer cannot be negative");
    });

    it("should validate rolling period with days", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "ROLLING",
        periodDays: 30,
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should reject rolling period without days", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "ROLLING",
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Period days must be specified for rolling availability");
    });

    it("should validate range period with valid dates", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "RANGE",
        periodStartDate: new Date("2024-01-01"),
        periodEndDate: new Date("2024-12-31"),
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should reject range period with invalid date order", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: 15,
        periodType: "RANGE",
        periodStartDate: new Date("2024-12-31"),
        periodEndDate: new Date("2024-01-01"),
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("End date must be after start date");
    });

    it("should accept null slot interval", () => {
      const config: SchedulingConfig = {
        minimumBookingNotice: 60,
        beforeEventBuffer: 15,
        afterEventBuffer: 15,
        slotInterval: null,
        periodType: "UNLIMITED",
      };
      const result = isValidSchedulingConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe("Event Type Booking Questions", () => {
    type QuestionType =
      | "text"
      | "textarea"
      | "number"
      | "select"
      | "multiselect"
      | "checkbox"
      | "radio"
      | "phone"
      | "email";

    interface BookingQuestion {
      name: string;
      type: QuestionType;
      label: string;
      required: boolean;
      placeholder?: string;
      options?: string[];
    }

    const isValidBookingQuestion = (question: BookingQuestion): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!question.name || question.name.trim().length === 0) {
        errors.push("Question name is required");
      }

      const nameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (question.name && !nameRegex.test(question.name)) {
        errors.push(
          "Question name must start with a letter and contain only alphanumeric characters and underscores"
        );
      }

      if (!question.label || question.label.trim().length === 0) {
        errors.push("Question label is required");
      }

      if (["select", "multiselect", "radio"].includes(question.type)) {
        if (!question.options || question.options.length === 0) {
          errors.push("Options are required for select, multiselect, and radio questions");
        }
      }

      return { valid: errors.length === 0, errors };
    };

    it("should validate correct text question", () => {
      const question: BookingQuestion = {
        name: "companyName",
        type: "text",
        label: "Company Name",
        required: true,
        placeholder: "Enter your company name",
      };
      const result = isValidBookingQuestion(question);
      expect(result.valid).toBe(true);
    });

    it("should validate correct select question with options", () => {
      const question: BookingQuestion = {
        name: "meetingType",
        type: "select",
        label: "Meeting Type",
        required: true,
        options: ["Sales Call", "Support", "Demo", "Other"],
      };
      const result = isValidBookingQuestion(question);
      expect(result.valid).toBe(true);
    });

    it("should reject select question without options", () => {
      const question: BookingQuestion = {
        name: "meetingType",
        type: "select",
        label: "Meeting Type",
        required: true,
      };
      const result = isValidBookingQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Options are required for select, multiselect, and radio questions");
    });

    it("should reject question with invalid name format", () => {
      const question: BookingQuestion = {
        name: "123invalid",
        type: "text",
        label: "Invalid Question",
        required: false,
      };
      const result = isValidBookingQuestion(question);
      expect(result.valid).toBe(false);
    });

    it("should reject question with empty label", () => {
      const question: BookingQuestion = {
        name: "validName",
        type: "text",
        label: "",
        required: false,
      };
      const result = isValidBookingQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Question label is required");
    });

    it("should validate all question types", () => {
      const types: QuestionType[] = ["text", "textarea", "number", "checkbox", "phone", "email"];
      types.forEach((type) => {
        const question: BookingQuestion = {
          name: "testQuestion",
          type,
          label: "Test Question",
          required: false,
        };
        expect(isValidBookingQuestion(question).valid).toBe(true);
      });
    });
  });

  describe("Team Event Type Validation", () => {
    type SchedulingType = "COLLECTIVE" | "ROUND_ROBIN" | "MANAGED";

    interface TeamEventType {
      title: string;
      slug: string;
      length: number;
      schedulingType: SchedulingType;
      hosts: Array<{ userId: number; isFixed: boolean }>;
      teamId: number;
    }

    const isValidTeamEventType = (eventType: TeamEventType): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!eventType.title || eventType.title.trim().length === 0) {
        errors.push("Title is required");
      }

      if (!eventType.slug || eventType.slug.trim().length === 0) {
        errors.push("Slug is required");
      }

      if (!eventType.hosts || eventType.hosts.length === 0) {
        errors.push("At least one host is required");
      }

      if (eventType.schedulingType === "COLLECTIVE") {
        const hasNonFixedHost = eventType.hosts?.some((h) => !h.isFixed);
        if (hasNonFixedHost) {
          errors.push("All hosts must be fixed for collective scheduling");
        }
      }

      if (eventType.schedulingType === "ROUND_ROBIN") {
        const allFixed = eventType.hosts?.every((h) => h.isFixed);
        if (allFixed && eventType.hosts?.length > 1) {
          errors.push("Round robin requires at least one non-fixed host");
        }
      }

      return { valid: errors.length === 0, errors };
    };

    it("should validate correct collective team event", () => {
      const eventType: TeamEventType = {
        title: "Team Meeting",
        slug: "team-meeting",
        length: 30,
        schedulingType: "COLLECTIVE",
        hosts: [
          { userId: 1, isFixed: true },
          { userId: 2, isFixed: true },
        ],
        teamId: 1,
      };
      const result = isValidTeamEventType(eventType);
      expect(result.valid).toBe(true);
    });

    it("should validate correct round robin team event", () => {
      const eventType: TeamEventType = {
        title: "Sales Call",
        slug: "sales-call",
        length: 30,
        schedulingType: "ROUND_ROBIN",
        hosts: [
          { userId: 1, isFixed: false },
          { userId: 2, isFixed: false },
        ],
        teamId: 1,
      };
      const result = isValidTeamEventType(eventType);
      expect(result.valid).toBe(true);
    });

    it("should reject team event without hosts", () => {
      const eventType: TeamEventType = {
        title: "Team Meeting",
        slug: "team-meeting",
        length: 30,
        schedulingType: "COLLECTIVE",
        hosts: [],
        teamId: 1,
      };
      const result = isValidTeamEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("At least one host is required");
    });

    it("should reject collective event with non-fixed hosts", () => {
      const eventType: TeamEventType = {
        title: "Team Meeting",
        slug: "team-meeting",
        length: 30,
        schedulingType: "COLLECTIVE",
        hosts: [
          { userId: 1, isFixed: true },
          { userId: 2, isFixed: false },
        ],
        teamId: 1,
      };
      const result = isValidTeamEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("All hosts must be fixed for collective scheduling");
    });

    it("should reject round robin with all fixed hosts", () => {
      const eventType: TeamEventType = {
        title: "Sales Call",
        slug: "sales-call",
        length: 30,
        schedulingType: "ROUND_ROBIN",
        hosts: [
          { userId: 1, isFixed: true },
          { userId: 2, isFixed: true },
        ],
        teamId: 1,
      };
      const result = isValidTeamEventType(eventType);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Round robin requires at least one non-fixed host");
    });
  });

  describe("Event Type Pricing Validation", () => {
    interface PricingConfig {
      price: number;
      currency: string;
      paymentRequired: boolean;
    }

    const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];

    const isValidPricing = (pricing: PricingConfig): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (pricing.paymentRequired) {
        if (pricing.price <= 0) {
          errors.push("Price must be greater than 0 when payment is required");
        }

        if (!SUPPORTED_CURRENCIES.includes(pricing.currency)) {
          errors.push(`Currency must be one of: ${SUPPORTED_CURRENCIES.join(", ")}`);
        }
      }

      if (pricing.price < 0) {
        errors.push("Price cannot be negative");
      }

      return { valid: errors.length === 0, errors };
    };

    it("should validate correct paid event", () => {
      const pricing: PricingConfig = {
        price: 50,
        currency: "USD",
        paymentRequired: true,
      };
      const result = isValidPricing(pricing);
      expect(result.valid).toBe(true);
    });

    it("should validate free event", () => {
      const pricing: PricingConfig = {
        price: 0,
        currency: "USD",
        paymentRequired: false,
      };
      const result = isValidPricing(pricing);
      expect(result.valid).toBe(true);
    });

    it("should reject paid event with zero price", () => {
      const pricing: PricingConfig = {
        price: 0,
        currency: "USD",
        paymentRequired: true,
      };
      const result = isValidPricing(pricing);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Price must be greater than 0 when payment is required");
    });

    it("should reject unsupported currency", () => {
      const pricing: PricingConfig = {
        price: 50,
        currency: "XYZ",
        paymentRequired: true,
      };
      const result = isValidPricing(pricing);
      expect(result.valid).toBe(false);
    });

    it("should reject negative price", () => {
      const pricing: PricingConfig = {
        price: -10,
        currency: "USD",
        paymentRequired: false,
      };
      const result = isValidPricing(pricing);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Price cannot be negative");
    });

    it("should validate all supported currencies", () => {
      SUPPORTED_CURRENCIES.forEach((currency) => {
        const pricing: PricingConfig = {
          price: 100,
          currency,
          paymentRequired: true,
        };
        expect(isValidPricing(pricing).valid).toBe(true);
      });
    });
  });
});

describe("Event Type Duplication", () => {
  const generateDuplicateSlug = (originalSlug: string, existingSlugs: string[]): string => {
    let newSlug = `${originalSlug}-copy`;
    let counter = 1;

    while (existingSlugs.includes(newSlug)) {
      newSlug = `${originalSlug}-copy-${counter}`;
      counter++;
    }

    return newSlug;
  };

  it("should generate copy slug when original doesn't exist", () => {
    const existingSlugs = ["meeting", "call"];
    const newSlug = generateDuplicateSlug("meeting", existingSlugs);
    expect(newSlug).toBe("meeting-copy");
  });

  it("should generate numbered copy slug when copy exists", () => {
    const existingSlugs = ["meeting", "meeting-copy"];
    const newSlug = generateDuplicateSlug("meeting", existingSlugs);
    expect(newSlug).toBe("meeting-copy-1");
  });

  it("should increment number for multiple copies", () => {
    const existingSlugs = ["meeting", "meeting-copy", "meeting-copy-1", "meeting-copy-2"];
    const newSlug = generateDuplicateSlug("meeting", existingSlugs);
    expect(newSlug).toBe("meeting-copy-3");
  });

  it("should handle empty existing slugs", () => {
    const existingSlugs: string[] = [];
    const newSlug = generateDuplicateSlug("meeting", existingSlugs);
    expect(newSlug).toBe("meeting-copy");
  });
});
