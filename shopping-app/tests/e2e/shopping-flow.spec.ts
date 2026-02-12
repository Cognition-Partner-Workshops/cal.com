import { test, expect } from "@playwright/test";

test.describe("Shopping Flow E2E", () => {
  test("should browse products on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Discover Amazing Products");
    const products = page.locator("[href^='/products/']");
    await expect(products.first()).toBeVisible();
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should search and filter products", async ({ page }) => {
    await page.goto("/");
    await page.fill('[data-testid="search-input"]', "headphones");
    await page.click('[data-testid="search-button"]');
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Wireless Bluetooth Headphones")).toBeVisible();
  });

  test("should view product detail", async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.locator("h1")).toContainText("Wireless Bluetooth Headphones");
    await expect(page.locator("text=$79.99")).toBeVisible();
    await expect(page.locator("text=In Stock")).toBeVisible();
  });

  test("full checkout flow - login, add to cart, checkout", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="login-email"]', "demo@shop.com");
    await page.fill('[data-testid="login-password"]', "password123");
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL("/");
    await expect(page.locator("text=Hi, Demo")).toBeVisible();

    await page.goto("/products/1");
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator("text=Added to Cart!")).toBeVisible();

    await page.goto("/cart");
    await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
    await page.click('[data-testid="checkout-button"]');

    await page.fill('[data-testid="shipping-name"]', "Demo User");
    await page.fill('[data-testid="shipping-address"]', "123 Main St");
    await page.fill('[data-testid="shipping-city"]', "New York");
    await page.fill('[data-testid="shipping-state"]', "NY");
    await page.fill('[data-testid="shipping-zip"]', "10001");
    await page.fill('[data-testid="card-number"]', "4242424242424242");
    await page.fill('[data-testid="card-expiry"]', "12/28");
    await page.fill('[data-testid="card-cvc"]', "123");
    await page.click('[data-testid="place-order-button"]');

    await expect(page.locator("text=Order Confirmed!")).toBeVisible({ timeout: 10000 });

    await page.click("text=View Orders");
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Order History")).toBeVisible();
  });

  test("should require login for cart access", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForURL(/\/login/);
    await expect(page.locator("text=Welcome Back")).toBeVisible();
  });

  test("should signup new user", async ({ page }) => {
    const email = `e2e-${Date.now()}@test.com`;
    await page.goto("/signup");
    await page.fill('[data-testid="signup-name"]', "E2E User");
    await page.fill('[data-testid="signup-email"]', email);
    await page.fill('[data-testid="signup-password"]', "testpass123");
    await page.fill('[data-testid="signup-confirm-password"]', "testpass123");
    await page.click('[data-testid="signup-submit"]');
    await page.waitForURL("/");
    await expect(page.locator("text=Hi, E2E")).toBeVisible();
  });
});
