import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:3099/api";

let token: string;

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo@shop.com",
      password: "password123",
    }),
  });
  const json = await res.json();
  return json.data.token;
}

describe("Cart & Orders API", () => {
  beforeAll(async () => {
    token = await login();
    await fetch(`${BASE_URL}/cart`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it("should return empty cart initially", async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
  });

  it("should reject cart access without auth", async () => {
    const res = await fetch(`${BASE_URL}/cart`);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("should add item to cart", async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: 1, quantity: 2 }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("should show items in cart after adding", async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].product_id).toBe(1);
  });

  it("should update cart item quantity", async () => {
    const cartRes = await fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cartJson = await cartRes.json();
    const itemId = cartJson.data[0].id;

    const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: 3 }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("should reject adding non-existent product", async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: 9999 }),
    });
    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
  });

  it("should reject order with empty cart after clearing", async () => {
    await fetch(`${BASE_URL}/cart`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shippingAddress: "123 Test St" }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("should create order from cart", async () => {
    await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: 2, quantity: 1 }),
    });

    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress: "123 Test St, City, ST 12345",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.orderId).toBeTruthy();
    expect(json.data.total).toBeGreaterThan(0);
  });

  it("should list orders", async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].items).toBeInstanceOf(Array);
  });

  it("should get order by ID", async () => {
    const listRes = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listJson = await listRes.json();
    const orderId = listJson.data[0].id;

    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.id).toBe(orderId);
    expect(json.data.items).toBeInstanceOf(Array);
  });

  it("should reject order without shipping address", async () => {
    await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: 3, quantity: 1 }),
    });

    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("should reject orders without auth", async () => {
    const res = await fetch(`${BASE_URL}/orders`);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });
});
