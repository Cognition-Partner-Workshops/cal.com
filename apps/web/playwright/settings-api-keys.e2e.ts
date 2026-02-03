import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { submitAndWaitForResponse } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ users }) => {
  await users.deleteAll();
});

test.describe("Settings - API Keys - Page Load", () => {
  test("should render the API keys page", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/developer/api-keys");
    await expect(page.getByRole("heading", { name: "API Keys" })).toBeVisible();
  });
});

test.describe("Settings - API Keys - Create", () => {
  test("should be able to create a new API key", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/settings/developer/api-keys");
    await page.getByTestId("new-api-key-button").click();
    await page.waitForSelector('[data-testid="api-key-dialog"]');
    await page.locator('[name="note"]').fill("Test API Key");
    await submitAndWaitForResponse(page, "/api/trpc/apiKeys/create?batch=1", {
      action: () => page.getByTestId("api-key-create-button").click(),
    });
    await expect(page.getByTestId("api-key-display")).toBeVisible();
    await page.getByTestId("api-key-done-button").click();
    await expect(page.getByText("Test API Key")).toBeVisible();
  });
});

test.describe("Settings - API Keys - Delete", () => {
  test("should be able to delete an API key", async ({ page, users, prisma }) => {
    const user = await users.create();
    await user.apiLogin();
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        note: "API Key to Delete",
        hashedKey: `test-hashed-key-${Date.now()}`,
      },
    });
    await page.goto("/settings/developer/api-keys");
    await expect(page.getByText("API Key to Delete")).toBeVisible();
    await page.getByTestId(`api-key-delete-${apiKey.id}`).click();
    await page.getByTestId("confirm-delete-api-key").click();
    await expect(page.getByText("API Key to Delete")).toBeHidden();
  });
});

test.describe("Settings - API Keys - Edit", () => {
  test("should be able to edit an API key note", async ({ page, users, prisma }) => {
    const user = await users.create();
    await user.apiLogin();
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        note: "Original API Key Name",
        hashedKey: `test-hashed-key-edit-${Date.now()}`,
      },
    });
    await page.goto("/settings/developer/api-keys");
    await expect(page.getByText("Original API Key Name")).toBeVisible();
    await page.getByTestId(`api-key-edit-${apiKey.id}`).click();
    await page.waitForSelector('[data-testid="api-key-edit-dialog"]');
    await page.locator('[name="note"]').clear();
    await page.locator('[name="note"]').fill("Updated API Key Name");
    await submitAndWaitForResponse(page, "/api/trpc/apiKeys/edit?batch=1", {
      action: () => page.getByTestId("api-key-save-button").click(),
    });
    await expect(page.getByText("Updated API Key Name")).toBeVisible();
  });
});
