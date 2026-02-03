import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Public Booking Page Edge Cases", () => {
  test("should show 404 for non-existent user", async ({ page }) => {
    const response = await page.goto("/nonexistent-user-12345");
    expect(response?.status()).toBe(404);
  });

  test("should show 404 for non-existent event type", async ({ page, users }) => {
    const user = await users.create();
    const response = await page.goto(`/${user.username}/nonexistent-event-type`);
    expect(response?.status()).toBe(404);
  });

  test("should handle special characters in URL gracefully", async ({ page, users }) => {
    const user = await users.create();
    const response = await page.goto(`/${user.username}/<script>alert('xss')</script>`);
    expect(response?.status()).toBe(404);
  });

  test("should display user profile correctly with minimal info", async ({ page, users }) => {
    const user = await users.create({
      name: null,
    });
    await page.goto(`/${user.username}`);

    const eventTypes = page.locator('[data-testid="event-types"]');
    await expect(eventTypes).toBeVisible();
  });
});
