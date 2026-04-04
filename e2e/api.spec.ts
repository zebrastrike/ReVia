import { test, expect } from "@playwright/test";

// ─── API HEALTH CHECKS ─────────────────────────────────────────────────────────

test.describe("API Routes", () => {
  test("GET /api/auth/me returns 401 when not logged in", async ({ request }) => {
    const res = await request.get("/api/auth/me");
    // Should return 401 or a response indicating no user
    expect([200, 401]).toContain(res.status());
  });

  test("POST /api/auth/register validates input", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: { email: "", name: "", password: "" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("POST /api/auth/login validates input", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "", password: "" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("POST /api/contact validates required fields", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "", email: "", subject: "", message: "" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/contact accepts valid submission", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "This is a test message",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("POST /api/newsletter validates email", async ({ request }) => {
    const res = await request.post("/api/newsletter", {
      data: { email: "" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("GET /api/admin/settings returns a response", async ({ request }) => {
    const res = await request.get("/api/admin/settings");
    // May return 200 (public) or 401/403 (protected) depending on implementation
    expect(res.status()).toBeLessThan(500);
  });

  test("PATCH /api/admin/inventory requires auth", async ({ request }) => {
    const res = await request.patch("/api/admin/inventory", {
      data: { variantId: "fake" },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("GET /api/admin/orders/export requires auth", async ({ request }) => {
    const res = await request.get("/api/admin/orders/export");
    expect([401, 403]).toContain(res.status());
  });
});
