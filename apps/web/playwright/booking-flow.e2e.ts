import { randomString } from "@calcom/lib/random";
import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import {
  bookTimeSlot,
  confirmBooking,
  selectFirstAvailableTimeSlotNextMonth,
  testEmail,
  testName,
} from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Booking flow — public page navigation", () => {
  test("can navigate to a public booking page and see event types", async ({ page, users }) => {
    const user = await users.create({ name: "Booking Flow User" });
    await page.goto(`/${user.username}`);

    await expect(page.locator('[data-testid="event-types"]')).toBeVisible();
    const eventTypeLinks = page.locator('[data-testid="event-type-link"]');
    await expect(eventTypeLinks.first()).toBeVisible();
    expect(await eventTypeLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("can select a time slot on a public booking page", async ({ page, users }) => {
    const user = await users.create({ name: "Timeslot User" });
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await expect(page.locator('[name="name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
  });
});

test.describe("Booking flow — attendee details and confirmation", () => {
  test("can fill attendee details and confirm a booking", async ({ page, users }) => {
    const user = await users.create({ name: "Confirm Booking User" });
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    const bookerEmail = `booker-${randomString(4)}@example.com`;
    const bookerName = "E2E Test Booker";

    await page.fill('[name="name"]', bookerName);
    await page.fill('[name="email"]', bookerEmail);

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator(`[data-testid="attendee-name-${bookerName}"]`)).toHaveText(bookerName);
    await expect(page.locator(`[data-testid="attendee-email-${bookerEmail}"]`)).toHaveText(bookerEmail);
  });

  test("can complete the full booking flow end-to-end", async ({ page, users }) => {
    const user = await users.create({ name: "Full Flow User" });
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await bookTimeSlot(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator(`[data-testid="attendee-name-${testName}"]`)).toHaveText(testName);
    await expect(page.locator(`[data-testid="attendee-email-${testEmail}"]`)).toHaveText(testEmail);
  });
});

test.describe("Booking flow — additional options", () => {
  test("can add notes to a booking", async ({ page, users }) => {
    const user = await users.create({ name: "Notes Booking User" });
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', testName);
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="notes"]', "This is a test booking note");

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
  });

  test("can book with additional guests", async ({ page, users }) => {
    const user = await users.create({ name: "Guest Booking User" });
    await page.goto(`/${user.username}`);

    const guestEmail = "guest@example.com";

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', testName);
    await page.fill('[name="email"]', testEmail);
    await page.locator('[data-testid="add-guests"]').click();
    await page.locator('input[type="email"]').nth(1).fill(guestEmail);

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator(`[data-testid="attendee-email-${guestEmail}"]`)).toHaveText(guestEmail);
  });

  test("booking success page shows correct booking title", async ({ page, users }) => {
    const user = await users.create({ name: "Title Check User" });
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await bookTimeSlot(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator("[data-testid=booking-title]")).toBeVisible();
  });
});
