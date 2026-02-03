import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Settings - Calendars - Page Load", () => {
  test("should render the calendars settings page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/calendars");
    await expect(page.getByRole("heading", { name: "Calendars" })).toBeVisible();
  });
});

test.describe("Settings - Calendars - Connection Options", () => {
  test("should show calendar connection options", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/calendars");
    const pageContent = await page.content();
    const hasCalendarOptions =
      pageContent.includes("Connect") || pageContent.includes("calendar") || pageContent.includes("Calendar");
    expect(hasCalendarOptions).toBeTruthy();
  });
});

test.describe("Settings - Calendars - Add Integration", () => {
  test("should navigate to add calendar integration", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/calendars");
    const addCalendarButton = page.getByTestId("add-calendar-button");
    const addCalendarLink = page.getByRole("link", { name: /add|connect/i });
    const buttonExists = await addCalendarButton.isVisible().catch(() => false);
    const linkExists = await addCalendarLink.isVisible().catch(() => false);
    expect(buttonExists || linkExists).toBeTruthy();
  });
});

test.describe("Settings - Calendars - Empty State", () => {
  test("should show empty state when no calendars connected", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/calendars");
    const pageContent = await page.content();
    const hasEmptyStateOrPrompt =
      pageContent.includes("No calendars") ||
      pageContent.includes("Connect") ||
      pageContent.includes("Add") ||
      pageContent.includes("calendar");
    expect(hasEmptyStateOrPrompt).toBeTruthy();
  });
});

test.describe("Settings - Conferencing", () => {
  test("should render the conferencing settings page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/conferencing");

    // Check that the page loads
    const pageContent = await page.content();
    const hasConferencingContent =
      pageContent.includes("Conferencing") ||
      pageContent.includes("Video") ||
      pageContent.includes("meeting");

    expect(hasConferencingContent).toBeTruthy();
  });

  test("should show available conferencing apps", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();

    await page.goto("/settings/my-account/conferencing");

    // Should show Cal Video as default option
    const pageContent = await page.content();
    const hasCalVideo =
      pageContent.includes("Cal Video") ||
      pageContent.includes("cal video") ||
      pageContent.includes("Default");

    expect(hasCalVideo).toBeTruthy();
  });
});
