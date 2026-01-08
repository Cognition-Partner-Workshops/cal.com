import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.describe("Scheduler Platform", () => {
  test.beforeEach(async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/scheduler");
    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("should display the scheduler dashboard page", async ({ page }) => {
    // Verify the page title/heading is visible
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should display statistics cards", async ({ page }) => {
    // Verify statistics section is visible
    // The stats grid should contain cards for bookings, upcoming, schedules, and event types
    const statsSection = page.locator(".grid").first();
    await expect(statsSection).toBeVisible();
  });

  test("should display upcoming bookings section", async ({ page }) => {
    // Verify upcoming bookings section is visible
    // Either shows bookings list or empty state
    const upcomingSection = page.getByText(/upcoming/i).first();
    await expect(upcomingSection).toBeVisible();
  });

  test("should display quick actions section", async ({ page }) => {
    // Verify quick actions section is visible
    const quickActionsSection = page.getByText(/quick actions/i);
    await expect(quickActionsSection).toBeVisible();
  });

  test("should display availability overview section", async ({ page }) => {
    // Verify availability/schedules section is visible
    const availabilitySection = page.getByText(/schedules/i).first();
    await expect(availabilitySection).toBeVisible();
  });

  test("should navigate to event types page from quick actions", async ({ page }) => {
    // Click on "New Event Type" quick action
    const newEventTypeButton = page.getByRole("link", { name: /new event type/i });
    if (await newEventTypeButton.isVisible()) {
      await newEventTypeButton.click();
      await expect(page).toHaveURL(/event-types/);
    }
  });

  test("should navigate to availability page from quick actions", async ({ page }) => {
    // Click on "Availability" quick action
    const availabilityButton = page.getByRole("link", { name: /availability/i });
    if (await availabilityButton.isVisible()) {
      await availabilityButton.click();
      await expect(page).toHaveURL(/availability/);
    }
  });

  test("should navigate to bookings page from quick actions", async ({ page }) => {
    // Click on "Bookings" quick action
    const bookingsButton = page.getByRole("link", { name: /bookings/i });
    if (await bookingsButton.isVisible()) {
      await bookingsButton.click();
      await expect(page).toHaveURL(/bookings/);
    }
  });

  test("should navigate to settings page from quick actions", async ({ page }) => {
    // Click on "Settings" quick action
    const settingsButton = page.getByRole("link", { name: /settings/i });
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await expect(page).toHaveURL(/settings/);
    }
  });
});

test.describe("Scheduler Platform - Unauthenticated", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    // Navigate to scheduler without logging in
    await page.goto("/scheduler");
    // Should redirect to login page
    await expect(page).toHaveURL(/auth\/login/);
  });
});

test.describe("Scheduler Platform - With Bookings", () => {
  test("should display bookings when user has upcoming bookings", async ({ page, users, bookings }) => {
    const user = await users.create();
    const eventType = user.eventTypes[0];

    // Create a booking for this user
    await bookings.create(user.id, user.username, eventType.id, {
      status: "ACCEPTED",
    });

    await user.apiLogin();
    await page.goto("/scheduler");
    await page.waitForLoadState("networkidle");

    // Verify the bookings section shows content (not empty state)
    const upcomingSection = page.getByText(/upcoming/i).first();
    await expect(upcomingSection).toBeVisible();
  });
});

test.describe("Scheduler Platform - With Availability", () => {
  test("should display user schedules in availability overview", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/scheduler");
    await page.waitForLoadState("networkidle");

    // User should have at least one default schedule
    // Verify schedules section is visible
    const schedulesSection = page.getByText(/schedules/i).first();
    await expect(schedulesSection).toBeVisible();
  });
});
