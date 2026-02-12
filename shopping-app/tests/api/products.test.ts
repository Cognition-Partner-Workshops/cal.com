import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:3099/api";

describe("Products API", () => {
  it("should list all products", async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.products).toBeInstanceOf(Array);
    expect(json.data.products.length).toBeGreaterThan(0);
    expect(json.data.total).toBeGreaterThan(0);
  });

  it("should return product with correct fields", async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const json = await res.json();
    const product = json.data.products[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("description");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("category");
    expect(product).toHaveProperty("image");
    expect(product).toHaveProperty("stock");
    expect(product).toHaveProperty("rating");
  });

  it("should return categories", async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const json = await res.json();
    expect(json.data.categories).toBeInstanceOf(Array);
    expect(json.data.categories.length).toBeGreaterThan(0);
  });

  it("should filter by category", async () => {
    const res = await fetch(`${BASE_URL}/products?category=Electronics`);
    const json = await res.json();
    expect(json.success).toBe(true);
    json.data.products.forEach((p: { category: string }) => {
      expect(p.category).toBe("Electronics");
    });
  });

  it("should search products by name", async () => {
    const res = await fetch(`${BASE_URL}/products?search=headphones`);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.products.length).toBeGreaterThan(0);
  });

  it("should filter by price range", async () => {
    const res = await fetch(`${BASE_URL}/products?minPrice=50&maxPrice=100`);
    const json = await res.json();
    expect(json.success).toBe(true);
    json.data.products.forEach((p: { price: number }) => {
      expect(p.price).toBeGreaterThanOrEqual(50);
      expect(p.price).toBeLessThanOrEqual(100);
    });
  });

  it("should sort products by price ascending", async () => {
    const res = await fetch(`${BASE_URL}/products?sortBy=price&sortOrder=asc`);
    const json = await res.json();
    const prices = json.data.products.map((p: { price: number }) => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it("should paginate results", async () => {
    const res = await fetch(`${BASE_URL}/products?page=1&limit=4`);
    const json = await res.json();
    expect(json.data.products.length).toBeLessThanOrEqual(4);
    expect(json.data.page).toBe(1);
    expect(json.data.totalPages).toBeGreaterThan(1);
  });

  it("should get a single product by ID", async () => {
    const res = await fetch(`${BASE_URL}/products/1`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe(1);
    expect(json.data.name).toBeTruthy();
  });

  it("should return 404 for non-existent product", async () => {
    const res = await fetch(`${BASE_URL}/products/9999`);
    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
  });
});
