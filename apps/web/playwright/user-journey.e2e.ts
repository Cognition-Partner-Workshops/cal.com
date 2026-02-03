import { randomString } from "@calcom/lib/random";
import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import {
  bookTimeSlot,
  selectFirstAvailableTimeSlotNextMonth,
  submitAndWaitForResponse,
  testEmail,
  testName,
} from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("User Journey - Dashboard Navigation", () => {
  test("User can navigate through main dashboard sections", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await test.step("Navigate to Event Types page", async () => {
      await page.goto("/event-types");
      await expect(page.getByRole("heading", { name: "Event Types" })).toBeVisible();
      await expect(page.locator("[data-testid=event-types]")).toBeVisible();
    });

    await test.step("Navigate to Bookings page", async () => {
      await page.goto("/bookings/upcoming");
      await expect(page.locator('[data-testid="horizontal-tab-upcoming"]')).toBeVisible();
    });

    await test.step("Navigate to Availability page", async () => {
      await page.goto("/availability");
      await expect(page.locator('[data-testid="schedules"]')).toBeVisible();
    });

    await test.step("Navigate to Settings page", async () => {
      await page.goto("/settings/my-account/profile");
      await expect(page.getByTestId("profile-form")).toBeVisible();
    });
  });

  test("User can access booking tabs (upcoming, unconfirmed, recurring, past, cancelled)", async ({
    page,
    users,
  }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/bookings/upcoming");

    await test.step("Check upcoming tab", async () => {
      await expect(page.locator('[data-testid="horizontal-tab-upcoming"]')).toBeVisible();
    });

    await test.step("Navigate to unconfirmed tab", async () => {
      await page.click('[data-testid="horizontal-tab-unconfirmed"]');
      await expect(page).toHaveURL(/.*bookings\/unconfirmed/);
    });

    await test.step("Navigate to recurring tab", async () => {
      await page.click('[data-testid="horizontal-tab-recurring"]');
      await expect(page).toHaveURL(/.*bookings\/recurring/);
    });

    await test.step("Navigate to past tab", async () => {
      await page.click('[data-testid="horizontal-tab-past"]');
      await expect(page).toHaveURL(/.*bookings\/past/);
    });

    await test.step("Navigate to cancelled tab", async () => {
      await page.click('[data-testid="horizontal-tab-cancelled"]');
      await expect(page).toHaveURL(/.*bookings\/cancelled/);
    });
  });
});

test.describe("User Journey - Event Type Creation", () => {
  test("User can create a new event type with custom settings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    const nonce = randomString(3);
    const eventTitle = `Custom Event ${nonce}`;

    await test.step("Create new event type", async () => {
      await page.click("[data-testid=new-event-type]");
      await page.fill("[name=title]", eventTitle);
      await page.fill("[name=length]", "45");
      await page.click("[type=submit]");
      await page.waitForURL((url) => url.pathname !== "/event-types");
    });

    await test.step("Verify event type was created", async () => {
      await expect(page.locator("[data-testid=event-title]")).toHaveValue(eventTitle);
    });

    await test.step("Save event type changes", async () => {
      await submitAndWaitForResponse(page, "/api/trpc/eventTypesHeavy/update?batch=1", {
        action: () => page.locator("[data-testid=update-eventtype]").click(),
      });
    });

    await test.step("Verify event appears in event types list", async () => {
      await page.goto("/event-types");
      await expect(page.locator(`text='${eventTitle}'`)).toBeVisible();
    });
  });
});

test.describe("User Journey - Event Type Configuration", () => {
  test("User can configure event type with multiple durations", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");

    await test.step("Navigate to existing event type", async () => {
      const eventTypeLink = page.locator("[data-testid=event-types] > li a").first();
      await eventTypeLink.click();
      await page.waitForURL((url) => !!url.pathname.match(/\/event-types\/.+/));
    });

    await test.step("Enable multiple durations", async () => {
      await page.click("[data-testid=vertical-tab-basics]");
      const multipleDurationToggle = page.locator('[data-testid="multiple-duration-checkbox"]');
      if (await multipleDurationToggle.isVisible()) {
        const isChecked = await multipleDurationToggle.isChecked();
        if (!isChecked) {
          await multipleDurationToggle.click();
        }
      }
    });

    await test.step("Save changes", async () => {
      await submitAndWaitForResponse(page, "/api/trpc/eventTypesHeavy/update?batch=1", {
        action: () => page.locator("[data-testid=update-eventtype]").click(),
      });
    });
  });
});

test.describe("User Journey - Complete Booking Flow", () => {
  test("Complete booking journey: book, view in dashboard, and verify details", async ({ page, users }) => {
    const organizer = await users.create({ name: "Organizer User" });
    const bookerEmail = users.trackEmail({ username: "booker", domain: "example.com" });
    const bookerName = "Test Booker";

    await test.step("Book an event as a guest", async () => {
      await page.goto(`/${organizer.username}/30-min`);
      await selectFirstAvailableTimeSlotNextMonth(page);
      await bookTimeSlot(page, { name: bookerName, email: bookerEmail });
      await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    });

    await test.step("Verify booking appears in organizer dashboard", async () => {
      await organizer.apiLogin();
      await page.goto("/bookings/upcoming");
      await page.waitForSelector('[data-testid="bookings"]');
      await expect(page.locator(`text=${bookerName}`).first()).toBeVisible();
    });

    await test.step("View booking details", async () => {
      await page.locator('[data-testid="booking-actions-dropdown"]').first().click();
      await expect(page.locator('[data-testid="reschedule"]')).toBeVisible();
      await expect(page.locator('[data-testid="cancel"]')).toBeVisible();
    });
  });

  test("Booking with notes and additional information", async ({ page, users }) => {
    const organizer = await users.create({ name: "Notes Test Organizer" });

    await test.step("Navigate to booking page", async () => {
      await page.goto(`/${organizer.username}/30-min`);
      await selectFirstAvailableTimeSlotNextMonth(page);
    });

    await test.step("Fill booking form with notes", async () => {
      await page.fill('[name="name"]', testName);
      await page.fill('[name="email"]', testEmail);
      const notesField = page.locator('[name="notes"]');
      if (await notesField.isVisible()) {
        await notesField.fill("This is a test booking with additional notes for the meeting.");
      }
    });

    await test.step("Complete booking", async () => {
      await submitAndWaitForResponse(page, "/api/book/event", {
        action: () => page.locator('[data-testid="confirm-book-button"]').click(),
      });
      await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    });
  });
});

test.describe("User Journey - Availability Management", () => {
  test("User can create and manage availability schedules", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await test.step("Navigate to availability page", async () => {
      await page.goto("/availability");
      await page.waitForSelector('[data-testid="schedules"]');
    });

    await test.step("Create a new schedule", async () => {
      await page.getByTestId("new-schedule").first().click();
      await page.locator('[id="name"]').fill("Evening Hours");
      await page.locator('[type="submit"]').click();
      await expect(page.getByTestId("availablity-title")).toHaveValue("Evening Hours");
    });

    await test.step("Modify schedule times", async () => {
      await page.getByTestId("go-back-button").click();
      await expect(page.locator('[data-testid="schedules"]')).toBeVisible();
    });
  });

  test("User can add date overrides to availability", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await test.step("Navigate to schedule", async () => {
      await page.goto("/availability");
      await page.waitForSelector('[data-testid="schedules"]');
      await page.getByTestId("schedules").first().click();
    });

    await test.step("Add a date override", async () => {
      await page.getByTestId("add-override").click();
      await page.locator('[id="modal-title"]').waitFor();
      await page.getByTestId("incrementMonth").click();
      await page.locator('[data-testid="day"][data-disabled="false"]').first().click();
      await page.getByTestId("date-override-mark-unavailable").click();
      await page.getByTestId("add-override-submit-btn").click();
      await page.getByTestId("dialog-rejection").click();
    });

    await test.step("Verify override was added", async () => {
      await expect(page.locator('[data-testid="date-overrides-list"] > li')).toHaveCount(1);
    });

    await test.step("Save changes", async () => {
      await submitAndWaitForResponse(page, "/api/trpc/availability/schedule.update?batch=1", {
        action: () => page.locator('[form="availability-form"][type="submit"]').click(),
      });
    });
  });
});

test.describe("User Journey - Profile Settings", () => {
  test("User can update profile information", async ({ page, users }) => {
    const user = await users.create({ name: "Profile Test User" });
    await user.apiLogin();

    await test.step("Navigate to profile settings", async () => {
      await page.goto("/settings/my-account/profile");
      await expect(page.getByTestId("profile-form")).toBeVisible();
    });

    await test.step("Update display name", async () => {
      const nameInput = page.locator('[name="name"]');
      await nameInput.clear();
      await nameInput.fill("Updated Profile Name");
    });

    await test.step("Update bio", async () => {
      const bioInput = page.locator('[name="bio"]');
      if (await bioInput.isVisible()) {
        await bioInput.clear();
        await bioInput.fill("This is my updated bio for testing purposes.");
      }
    });

    await test.step("Save profile changes", async () => {
      await page.getByTestId("profile-submit-button").click();
      await expect(page.getByTestId("toast-success")).toBeVisible();
    });
  });

  test("User can navigate through settings sections", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await test.step("Navigate to general settings", async () => {
      await page.goto("/settings/my-account/general");
      await expect(page.locator('[data-testid="general-settings-form"]')).toBeVisible();
    });

    await test.step("Navigate to calendars settings", async () => {
      await page.goto("/settings/my-account/calendars");
      await expect(page.locator("text=Calendars")).toBeVisible();
    });

    await test.step("Navigate to conferencing settings", async () => {
      await page.goto("/settings/my-account/conferencing");
      await expect(page.locator("text=Conferencing")).toBeVisible();
    });

    await test.step("Navigate to appearance settings", async () => {
      await page.goto("/settings/my-account/appearance");
      await expect(page.locator("text=Appearance")).toBeVisible();
    });
  });
});

test.describe("User Journey - Booking Cancellation", () => {
  test("Organizer can cancel a booking from dashboard", async ({ page, users, bookings }) => {
    const organizer = await users.create({ name: "Cancel Test Organizer" });
    const eventType = organizer.eventTypes[0];

    await test.step("Create a booking", async () => {
      await bookings.create(organizer.id, organizer.username, eventType.id);
    });

    await test.step("Login and navigate to bookings", async () => {
      await organizer.apiLogin();
      await page.goto("/bookings/upcoming");
      await page.waitForSelector('[data-testid="bookings"]');
    });

    await test.step("Open booking actions menu", async () => {
      await page.locator('[data-testid="booking-actions-dropdown"]').first().click();
    });

    await test.step("Click cancel and provide reason", async () => {
      await page.locator('[data-testid="cancel"]').click();
      await page.waitForSelector('[data-testid="cancel_reason"]');
      await page.fill('[data-testid="cancel_reason"]', "Test cancellation reason");
    });

    await test.step("Confirm cancellation", async () => {
      await submitAndWaitForResponse(page, "/api/trpc/bookings/cancel?batch=1", {
        action: () => page.locator('[data-testid="confirm_cancel"]').click(),
      });
    });

    await test.step("Verify booking moved to cancelled", async () => {
      await page.goto("/bookings/cancelled");
      await expect(page.locator('[data-testid="bookings"]')).toBeVisible();
    });
  });
});

test.describe("User Journey - Public Booking Page", () => {
  test("Public booking page displays correct information", async ({ page, users }) => {
    const organizer = await users.create({ name: "Public Page Test" });

    await test.step("Navigate to user's public page", async () => {
      await page.goto(`/${organizer.username}`);
    });

    await test.step("Verify event types are displayed", async () => {
      await expect(page.locator('[data-testid="event-types"]')).toBeVisible();
      const eventTypeLinks = page.locator('[data-testid="event-type-link"]');
      const count = await eventTypeLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("Click on an event type", async () => {
      await page.locator('[data-testid="event-type-link"]').first().click();
      await expect(page.locator('[data-testid="incrementMonth"]')).toBeVisible();
    });

    await test.step("Verify calendar is displayed", async () => {
      await expect(page.locator('[data-testid="calendar-empty-cell"]').first()).toBeVisible();
    });
  });

  test("Booking page shows available time slots", async ({ page, users }) => {
    const organizer = await users.create({ name: "Time Slots Test" });

    await test.step("Navigate to event type page", async () => {
      await page.goto(`/${organizer.username}/30-min`);
    });

    await test.step("Navigate to next month", async () => {
      await page.getByTestId("incrementMonth").click();
    });

    await test.step("Select a day with available slots", async () => {
      await page.locator('[data-testid="day"][data-disabled="false"]').first().click();
    });

    await test.step("Verify time slots are displayed", async () => {
      await expect(page.locator('[data-testid="time"]').first()).toBeVisible();
    });
  });
});

test.describe("User Journey - Event Type Visibility", () => {
  test("User can hide and show event types", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await test.step("Navigate to event types", async () => {
      await page.goto("/event-types");
      await page.waitForSelector('[data-testid="event-types"]');
    });

    await test.step("Open event type options", async () => {
      const firstEventType = page.locator('[data-testid="event-types"] > li').first();
      const optionsButton = firstEventType.locator('[data-testid^="event-type-options-"]');
      await optionsButton.click();
    });

    await test.step("Toggle event type visibility", async () => {
      const hideButton = page.locator('[data-testid^="event-type-hide-"]');
      if (await hideButton.isVisible()) {
        await hideButton.click();
      }
    });
  });
});

test.describe("User Journey - Booking Confirmation Flow", () => {
  test("Opt-in event requires confirmation from organizer", async ({ page, users }) => {
    const organizer = await users.create({ name: "Opt-in Test Organizer" });

    await test.step("Book an opt-in event", async () => {
      await page.goto(`/${organizer.username}/opt-in`);
      await selectFirstAvailableTimeSlotNextMonth(page);
      await bookTimeSlot(page);
      await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    });

    await test.step("Login as organizer and check unconfirmed bookings", async () => {
      await organizer.apiLogin();
      await page.goto("/bookings/unconfirmed");
      await page.waitForSelector('[data-testid="bookings"]');
    });

    await test.step("Confirm the booking", async () => {
      const confirmButton = page.locator('[data-testid="confirm"]').first();
      if (await confirmButton.isVisible()) {
        await Promise.all([
          page.waitForResponse((response) => response.url().includes("/api/trpc/bookings/confirm")),
          confirmButton.click(),
        ]);
      }
    });

    await test.step("Verify booking moved to upcoming", async () => {
      await page.goto("/bookings/upcoming");
      await expect(page.locator('[data-testid="bookings"]')).toBeVisible();
    });
  });
});
