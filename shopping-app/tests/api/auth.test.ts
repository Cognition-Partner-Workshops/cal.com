import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3099/api";

describe("Auth API", () => {
  const testEmail = `test-${Date.now()}@example.com`;

  it("should sign up a new user", async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: "testpass123",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.token).toBeTruthy();
    expect(json.data.user.email).toBe(testEmail);
  });

  it("should reject duplicate email signup", async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dupe User",
        email: testEmail,
        password: "testpass123",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(409);
    expect(json.success).toBe(false);
  });

  it("should reject signup with short password", async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pass",
        email: "short@example.com",
        password: "12345",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("should login with valid credentials", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@shop.com",
        password: "password123",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.token).toBeTruthy();
    expect(json.data.user.email).toBe("demo@shop.com");
  });

  it("should reject login with invalid password", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@shop.com",
        password: "wrongpassword",
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("should get current user with valid token", async () => {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@shop.com",
        password: "password123",
      }),
    });
    const loginJson = await loginRes.json();
    const token = loginJson.data.token;

    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.email).toBe("demo@shop.com");
  });

  it("should reject unauthenticated request to /me", async () => {
    const res = await fetch(`${BASE_URL}/auth/me`);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("should reject request with invalid token", async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: "Bearer invalid-token" },
    });
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("should reject signup with missing fields", async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("should reject login with missing fields", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });
});
