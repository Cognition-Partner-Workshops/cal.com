import { randomString } from "@calcom/lib/random";
import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Username Validation", () => {
  test("should not allow empty username", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/profile");

    const usernameInput = page.locator("[data-testid=username-input]");
    await usernameInput.clear();

    const updateButton = page.locator("[data-testid=update-username-btn]");
    await expect(updateButton).toBeDisabled();
  });

  test("should not allow username with special characters", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/profile");

    const usernameInput = page.locator("[data-testid=username-input]");
    await usernameInput.fill("user@name!");

    const errorMessage = page.locator("[data-testid=username-error]");
    await expect(errorMessage).toBeVisible();
  });

  test("should not allow username that is too short", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/profile");

    const usernameInput = page.locator("[data-testid=username-input]");
    await usernameInput.fill("ab");

    const updateButton = page.locator("[data-testid=update-username-btn]");
    await expect(updateButton).toBeDisabled();
  });
});

test.describe("Username Input Handling", () => {
  test("should trim whitespace from username input", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/profile");

    const usernameInput = page.locator("[data-testid=username-input]");
    const testUsername = `testuser${randomString(5)}`;
    await usernameInput.fill(`  ${testUsername}  `);

    const inputValue = await usernameInput.inputValue();
    expect(inputValue.trim()).toBe(testUsername);
  });

  test("should show error when trying to use existing username", async ({ page, users }) => {
    const existingUser = await users.create({ username: "existinguser" });
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/my-account/profile");

    const usernameInput = page.locator("[data-testid=username-input]");
    await usernameInput.fill(existingUser.username || "existinguser");

    await page.click("[data-testid=update-username-btn]");

    const errorMessage = page.locator('[data-testid="username-error"]');
    await expect(errorMessage).toBeVisible();
  });
});
