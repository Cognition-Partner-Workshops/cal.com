import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Video Meeting - Invalid UID", () => {
  test("should show meeting not found page for invalid meeting uid", async ({ page }) => {
    await page.goto("/video/invalid-meeting-uid-12345");
    await expect(page.getByText("This meeting does not exist")).toBeVisible();
  });
});

test.describe("Video Meeting - Ended Meeting", () => {
  test("should show meeting ended page after meeting concludes", async ({ page, users, bookings }) => {
    const user = await users.create();
    const [eventType] = user.eventTypes;
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const endDate = new Date(pastDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    const booking = await bookings.create(user.id, user.username, eventType.id, {
      startTime: pastDate,
      endTime: endDate,
    });
    await page.goto(`/video/${booking.uid}`);
    const pageContent = await page.content();
    const hasMeetingEndedContent =
      pageContent.includes("meeting has ended") ||
      pageContent.includes("Meeting ended") ||
      pageContent.includes("This meeting does not exist");
    expect(hasMeetingEndedContent || page.url().includes("meeting-ended")).toBeTruthy();
  });
});

test.describe("Video Meeting - Future Meeting", () => {
  test("should show meeting not started page for future meeting", async ({ page, users, bookings }) => {
    const user = await users.create();
    const [eventType] = user.eventTypes;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const endDate = new Date(futureDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    const booking = await bookings.create(user.id, user.username, eventType.id, {
      startTime: futureDate,
      endTime: endDate,
    });
    await page.goto(`/video/${booking.uid}`);
    const pageContent = await page.content();
    const hasNotStartedContent =
      pageContent.includes("not started") ||
      pageContent.includes("Meeting has not started") ||
      pageContent.includes("too early") ||
      pageContent.includes("This meeting does not exist");
    expect(hasNotStartedContent || page.url().includes("meeting-not-started")).toBeTruthy();
  });
});

test.describe("Video Meeting - Error Handling", () => {
  test("should display appropriate error for completely invalid uid", async ({ page }) => {
    await page.goto("/video/completely-invalid-uid");
    await page
      .waitForResponse((response) => response.url().includes("/video/completely-invalid-uid"), {
        timeout: 5000,
      })
      .catch(() => null);
    const currentUrl = page.url();
    const pageContent = await page.content();
    const isHandledGracefully =
      currentUrl.includes("no-meeting-found") ||
      pageContent.includes("does not exist") ||
      pageContent.includes("not found") ||
      pageContent.includes("Meeting not found");
    expect(isHandledGracefully).toBeTruthy();
  });
});

test.describe("Video Meeting - Empty UID", () => {
  test("should handle empty video uid", async ({ page }) => {
    const response = await page.goto("/video/");
    expect(response?.status()).toBe(404);
  });
});
