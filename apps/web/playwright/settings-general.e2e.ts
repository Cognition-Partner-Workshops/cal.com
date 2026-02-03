import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { submitAndWaitForResponse } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Settings - General - Page Load", () => {
  test("should render the general settings page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/general");
    await expect(page.getByText("Language")).toBeVisible();
    await expect(page.getByText("Timezone")).toBeVisible();
    await expect(page.getByText("Time format")).toBeVisible();
  });
});

test.describe("Settings - General - Timezone", () => {
  test("should be able to change timezone", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/general");
    await page.waitForSelector('[data-testid="timezone-select"]');
    await page.getByTestId("timezone-select").click();
    await page.locator('[aria-label="Timezone Select"]').fill("New York");
    await page.keyboard.press("Enter");
    await submitAndWaitForResponse(page, "/api/trpc/me/updateProfile?batch=1", {
      action: () => page.getByTestId("update-general-settings-btn").click(),
    });
    await expect(page.getByTestId("toast-success")).toBeVisible();
  });
});

test.describe("Settings - General - Time Format", () => {
  test("should be able to change time format to 12h", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/general");
    await page.waitForSelector('[data-testid="time-format-select"]');
    await page.getByTestId("time-format-select").click();
    await page.locator('text="12h"').click();
    await submitAndWaitForResponse(page, "/api/trpc/me/updateProfile?batch=1", {
      action: () => page.getByTestId("update-general-settings-btn").click(),
    });
    await expect(page.getByTestId("toast-success")).toBeVisible();
  });
});

test.describe("Settings - General - Week Start", () => {
  test("should be able to change week start day", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/general");
    await page.waitForSelector('[data-testid="weekstart-select"]');
    await page.getByTestId("weekstart-select").click();
    await page.locator('text="Monday"').click();
    await submitAndWaitForResponse(page, "/api/trpc/me/updateProfile?batch=1", {
      action: () => page.getByTestId("update-general-settings-btn").click(),
    });
    await expect(page.getByTestId("toast-success")).toBeVisible();
  });
});
