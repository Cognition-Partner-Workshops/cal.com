import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { bookTimeSlot, confirmBooking, selectFirstAvailableTimeSlotNextMonth } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Booking Flow with Notes", () => {
  test("should allow booking with additional notes", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "Test Booker");
    await page.fill('[name="email"]', "booker@example.com");
    await page.fill('[name="notes"]', "This is a test booking with additional notes for the meeting.");

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
  });

  test("should preserve notes when going back and returning to booking form", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    const testNotes = "Important meeting notes that should be preserved";
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="notes"]', testNotes);

    await page.click('[data-testid="back"]');

    await selectFirstAvailableTimeSlotNextMonth(page);

    await expect(page.locator('[name="notes"]')).toHaveValue(testNotes);
  });
});

test.describe("Booking Flow with Guests", () => {
  test("should allow adding a single guest to booking", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "Primary Booker");
    await page.fill('[name="email"]', "primary@example.com");

    await page.locator('[data-testid="add-guests"]').click();
    await page.locator('input[type="email"]').nth(1).fill("guest1@example.com");

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator('[data-testid="attendee-email-guest1@example.com"]')).toHaveText(
      "guest1@example.com"
    );
  });

  test("should allow adding multiple guests to booking", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "Primary Booker");
    await page.fill('[name="email"]', "primary@example.com");

    await page.locator('[data-testid="add-guests"]').click();
    await page.locator('input[type="email"]').nth(1).fill("guest1@example.com");

    await page.locator('[data-testid="add-another-guest"]').click();
    await page.locator('input[type="email"]').nth(2).fill("guest2@example.com");

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator('[data-testid="attendee-email-guest1@example.com"]')).toHaveText(
      "guest1@example.com"
    );
    await expect(page.locator('[data-testid="attendee-email-guest2@example.com"]')).toHaveText(
      "guest2@example.com"
    );
  });
});

test.describe("Booking Confirmation Page", () => {
  test("should display correct booking details on success page", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    const bookerName = "Confirmation Test User";
    const bookerEmail = "confirmation@example.com";

    await page.fill('[name="name"]', bookerName);
    await page.fill('[name="email"]', bookerEmail);

    await confirmBooking(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    await expect(page.locator(`[data-testid="attendee-name-${bookerName}"]`)).toHaveText(bookerName);
    await expect(page.locator(`[data-testid="attendee-email-${bookerEmail}"]`)).toHaveText(bookerEmail);
  });

  test("should show booking title on success page", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await bookTimeSlot(page);

    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
    const bookingTitle = page.locator("[data-testid=booking-title]");
    await expect(bookingTitle).toBeVisible();
  });
});

test.describe("Booking Time Selection", () => {
  test("should show available time slots for next month", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    await page.getByTestId("incrementMonth").click();

    await page.locator('[data-testid="day"][data-disabled="false"]').nth(0).click();

    const timeSlots = page.locator('[data-testid="time"]');
    await expect(timeSlots.first()).toBeVisible();
  });

  test("should allow selecting different time slots", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    await page.getByTestId("incrementMonth").click();
    await page.locator('[data-testid="day"][data-disabled="false"]').nth(0).click();

    const timeSlots = page.locator('[data-testid="time"]');
    const slotCount = await timeSlots.count();

    if (slotCount > 1) {
      await timeSlots.nth(1).click();
      await expect(page.locator('[name="name"]')).toBeVisible();
    }
  });

  test("should navigate between months", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    const incrementButton = page.getByTestId("incrementMonth");
    await expect(incrementButton).toBeVisible();

    await incrementButton.click();

    await page.locator('[data-testid="day"]').first().waitFor();
  });
});

test.describe("Booking Form Validation", () => {
  test("should require name field", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="email"]', "test@example.com");

    await page.locator('[data-testid="confirm-book-button"]').click();

    const nameInput = page.locator('[name="name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should require valid email format", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "invalid-email");

    await page.locator('[data-testid="confirm-book-button"]').click();

    const emailInput = page.locator('[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Booking Page Display", () => {
  test("should display event type title on booking page", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    const eventTitle = page.locator("[data-testid=event-title]");
    await expect(eventTitle).toBeVisible();
  });

  test("should display event duration on booking page", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    const durationInfo = page.locator("[data-testid=event-meta]");
    await expect(durationInfo).toBeVisible();
  });

  test("should display organizer avatar on booking page", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    const avatar = page.locator('[data-testid="avatar-href"]');
    await expect(avatar).toBeVisible();
  });
});
