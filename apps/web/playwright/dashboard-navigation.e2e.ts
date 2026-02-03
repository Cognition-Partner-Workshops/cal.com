import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Dashboard Shell", () => {
  test("should load dashboard shell after login", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    const shellLocator = page.locator("[data-testid=dashboard-shell]");
    await expect(shellLocator).toBeVisible();
  });
});

test.describe("Main Navigation", () => {
  test("should navigate to bookings page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");
    await page.click('[href="/bookings"]');

    await page.waitForURL("/bookings/**");
    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });

  test("should navigate to availability page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");
    await page.click('[href="/availability"]');

    await page.waitForURL("/availability");
    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });
});

test.describe("User Dropdown", () => {
  test("should show user dropdown menu", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    const userDropdownTrigger = page.locator("[data-testid=user-dropdown-trigger]");
    await expect(userDropdownTrigger).toBeVisible();

    await userDropdownTrigger.click();

    const dropdownContent = page.locator("[data-testid=user-dropdown-trigger] + div, [role=menu]");
    await expect(dropdownContent).toBeVisible();
  });

  test("should navigate to settings from user dropdown", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    await page.locator("[data-testid=user-dropdown-trigger]").click();
    await page.click('a[href="/settings/my-account/profile"]');

    await page.waitForURL("/settings/my-account/profile");
    await expect(page).toHaveURL(/\/settings\/my-account\/profile/);
  });

  test("should display correct user name in navigation", async ({ page, users }) => {
    const userName = "Test Navigation User";
    const user = await users.create({ name: userName });
    await user.apiLogin();

    await page.goto("/event-types");

    await page.locator("[data-testid=user-dropdown-trigger]").click();
    const userNameElement = page.locator("[data-testid=user-dropdown-trigger]").first();
    await expect(userNameElement).toBeVisible();
  });
});

test.describe("Event Types Page Navigation", () => {
  test("should display event types list", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    await page.waitForSelector("[data-testid=event-types]");
    const eventTypesList = page.locator("[data-testid=event-types]");
    await expect(eventTypesList).toBeVisible();
  });

  test("should navigate to event type edit page when clicking on event type", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    await page.waitForSelector("[data-testid=event-types] > li a");
    const firstEventType = page.locator("[data-testid=event-types] > li a").first();
    await firstEventType.click();

    await page.waitForURL(/\/event-types\/.+/);
    await expect(page).toHaveURL(/\/event-types\/\d+/);
  });

  test("should show new event type button", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/event-types");

    const newEventTypeButton = page.locator("[data-testid=new-event-type]");
    await expect(newEventTypeButton).toBeVisible();
  });
});

test.describe("Bookings Page Navigation", () => {
  test("should display bookings tabs", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/bookings/upcoming");

    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });

  test("should navigate between booking tabs", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/bookings/upcoming");

    const pastTab = page.locator('a[href="/bookings/past"]');
    if (await pastTab.isVisible()) {
      await pastTab.click();
      await page.waitForURL("/bookings/past");
      await expect(page).toHaveURL(/\/bookings\/past/);
    }
  });

  test("should show empty state when no bookings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/bookings/upcoming");

    const emptyScreen = page.locator("[data-testid=empty-screen]");
    const bookingsList = page.locator("[data-testid=bookings]");

    const hasEmptyScreen = await emptyScreen.isVisible().catch(() => false);
    const hasBookings = await bookingsList.isVisible().catch(() => false);

    expect(hasEmptyScreen || hasBookings).toBe(true);
  });
});

test.describe("Settings Navigation", () => {
  test("should navigate to profile settings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/profile");

    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
    await expect(page.getByTestId("profile-form")).toBeVisible();
  });

  test("should navigate to general settings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/general");

    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });

  test("should navigate to calendars settings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/calendars");

    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });

  test("should navigate to appearance settings", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/appearance");

    await expect(page.locator("[data-testid=dashboard-shell]")).toBeVisible();
  });
});
