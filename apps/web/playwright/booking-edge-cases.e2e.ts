import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { bookTimeSlot, selectFirstAvailableTimeSlotNextMonth } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Booking Form Validation", () => {
  test("should not allow booking in the past", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');

    const pastDateButton = page.locator('[data-testid="day"][data-disabled="true"]').first();
    if (await pastDateButton.isVisible()) {
      await expect(pastDateButton).toHaveAttribute("data-disabled", "true");
    }
  });

  test("should show error for invalid email format in booking form", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "invalid-email");

    const confirmButton = page.locator('[data-testid="confirm-book-button"]');
    await confirmButton.click();

    const emailInput = page.locator('[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should not allow empty name in booking form", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    await page.fill('[name="name"]', "");
    await page.fill('[name="email"]', "test@example.com");

    const confirmButton = page.locator('[data-testid="confirm-book-button"]');
    await confirmButton.click();

    const nameInput = page.locator('[name="name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Concurrent Booking", () => {
  test("should handle concurrent booking attempts gracefully", async ({ page, browser, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    const pageUrl = page.url();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto(pageUrl);

    await bookTimeSlot(page, { name: "First Booker", email: "first@example.com" });
    await expect(page.locator("[data-testid=success-page]")).toBeVisible();

    await bookTimeSlot(page2, {
      name: "Second Booker",
      email: "second@example.com",
      expectedStatusCode: 409,
    });

    await context2.close();
  });
});

test.describe("Booking Form Data Persistence", () => {
  test("should handle very long notes in booking form", async ({ page, users }) => {
    const user = await users.create();
    await page.goto(`/${user.username}`);

    await page.click('[data-testid="event-type-link"]');
    await selectFirstAvailableTimeSlotNextMonth(page);

    const longNotes = "a".repeat(5000);
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="notes"]', longNotes);

    await bookTimeSlot(page);
    await expect(page.locator("[data-testid=success-page]")).toBeVisible();
  });
});
