import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.describe("Protected Route Redirects", () => {
  test("should redirect to login when accessing protected route without auth", async ({ page }) => {
    await page.goto("/event-types");
    await expect(page).toHaveURL(/.*\/auth\/login.*/);
  });

  test("should redirect to login when accessing settings without auth", async ({ page }) => {
    await page.goto("/settings/my-account/profile");
    await expect(page).toHaveURL(/.*\/auth\/login.*/);
  });

  test("should redirect to login when accessing bookings without auth", async ({ page }) => {
    await page.goto("/bookings/upcoming");
    await expect(page).toHaveURL(/.*\/auth\/login.*/);
  });
});

test.describe("Login Form Validation", () => {
  test("should handle invalid login credentials", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('[name="email"]', "nonexistent@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('[data-testid="alert"]');
    await expect(errorMessage).toBeVisible();
  });

  test("should not allow login with empty email", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('[name="email"]', "");
    await page.fill('[name="password"]', "somepassword");
    await page.click('button[type="submit"]');

    const emailInput = page.locator('[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should not allow login with empty password", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "");
    await page.click('button[type="submit"]');

    const passwordInput = page.locator('[name="password"]');
    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Signup Email Validation", () => {
  test("should not allow signup with invalid email format", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=Create your account")).toBeVisible();

    const continueWithEmailButton = page.getByTestId("continue-with-email-button");
    await continueWithEmailButton.click();

    await page.fill('[name="username"]', "testuser");
    await page.fill('[name="email"]', "invalid-email");
    await page.fill('[name="password"]', "Password123!");

    const submitButton = page.getByTestId("signup-submit-button");
    await submitButton.click();

    const emailInput = page.locator('[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

test.describe("Signup Password Validation", () => {
  test("should not allow signup with weak password", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=Create your account")).toBeVisible();

    const continueWithEmailButton = page.getByTestId("continue-with-email-button");
    await continueWithEmailButton.click();

    await page.fill('[name="username"]', "testuser");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "weak");

    const submitButton = page.getByTestId("signup-submit-button");
    await submitButton.click();

    const alert = page.locator('[data-testid="alert"]');
    await expect(alert).toBeVisible();
  });
});

test.describe("Signup Username Validation", () => {
  test("should not allow signup with username containing spaces", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=Create your account")).toBeVisible();

    const continueWithEmailButton = page.getByTestId("continue-with-email-button");
    await continueWithEmailButton.click();

    await page.fill('[name="username"]', "user name with spaces");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "Password123!");

    const submitButton = page.getByTestId("signup-submit-button");
    await submitButton.click();

    const alert = page.locator('[data-testid="alert"]');
    await expect(alert).toBeVisible();
  });
});
