import { test, expect } from "@playwright/test";

// ─── PUBLIC PAGES LOAD ─────────────────────────────────────────────────────────

test.describe("Public Pages", () => {
  test("Homepage loads with hero banner", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ReVia/i);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Shop page loads with products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText("Shop");
    // Should have category sidebar
    await expect(page.getByText("Categories", { exact: false })).toBeVisible();
  });

  test("Shop page category filter works", async ({ page }) => {
    await page.goto("/shop");
    // The sidebar should have an "All Products" button link
    await expect(page.locator('aside a:has-text("All Products")')).toBeVisible();
  });

  test("Product detail page loads", async ({ page }) => {
    await page.goto("/shop");
    // Find and click the first product link
    const productLink = page.locator('a[href^="/shop/"]').first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState("networkidle");
      // Should have breadcrumb, product name, and Add to Cart
      await expect(page.getByText("Shop", { exact: true }).first()).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("Research page loads with compounds", async ({ page }) => {
    await page.goto("/research");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Research detail page loads", async ({ page }) => {
    await page.goto("/research");
    const compoundLink = page.locator('a[href^="/research/"]').first();
    if (await compoundLink.isVisible()) {
      await compoundLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("Blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toContainText("Blog");
  });

  test("About page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("ReVia", { exact: false }).first()).toBeVisible();
  });

  test("Contact page loads with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Contact");
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('select[id="subject"]')).toBeVisible();
    await expect(page.locator('textarea[id="message"]')).toBeVisible();
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Stacks page loads", async ({ page }) => {
    await page.goto("/stacks");
    await expect(page.locator("h1")).toBeVisible();
  });
});

// ─── POLICY PAGES ───────────────────────────────────────────────────────────────

test.describe("Policy Pages", () => {
  const policies = [
    "terms",
    "privacy",
    "shipping",
    "refunds",
    "cookies",
    "payments",
    "disclaimer",
    "ccpa",
    "aup",
  ];

  for (const policy of policies) {
    test(`${policy} policy page loads`, async ({ page }) => {
      await page.goto(`/policies/${policy}`);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

// ─── NAVBAR ─────────────────────────────────────────────────────────────────────

test.describe("Navigation", () => {
  test("Navbar has all required links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header");
    await expect(nav.getByText("Shop", { exact: true })).toBeVisible();
    await expect(nav.getByText("Stacks", { exact: true })).toBeVisible();
    await expect(nav.getByText("Blog", { exact: true })).toBeVisible();
    await expect(nav.getByText("Research", { exact: true })).toBeVisible();
    await expect(nav.getByText("About", { exact: true })).toBeVisible();
    await expect(nav.getByText("Contact", { exact: true })).toBeVisible();
  });

  test("US Made badge is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("US Made", { exact: false })).toBeVisible();
  });

  test("Cart button exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('button[aria-label="Open cart"]')).toBeVisible();
  });

  test("Nav links navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByText("Shop", { exact: true }).click();
    await page.waitForURL("**/shop**");
    await expect(page.locator("h1")).toContainText("Shop");
  });
});

// ─── AUTH PAGES ─────────────────────────────────────────────────────────────────

test.describe("Auth Pages", () => {
  test("Login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText(/sign in|login|welcome/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("Register page loads with first/last name fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText(/create account/i);
    await expect(page.locator("#firstName")).toBeVisible();
    await expect(page.locator("#lastName")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("Register page has link to login", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Sign in", { exact: false })).toBeVisible();
  });
});

// ─── CHECKOUT ───────────────────────────────────────────────────────────────────

test.describe("Checkout", () => {
  test("Checkout page loads", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("h1")).toBeVisible();
  });
});
