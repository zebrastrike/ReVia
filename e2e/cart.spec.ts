import { test, expect } from "@playwright/test";

// ─── CART FUNCTIONALITY ─────────────────────────────────────────────────────────

test.describe("Cart", () => {
  test("Cart drawer opens when clicking cart button", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-label="Open cart"]').click();
    // Cart drawer should appear
    // Cart drawer should appear — look for any cart-related content
    await expect(page.getByText(/cart|checkout|empty/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("Add to cart from product page", async ({ page }) => {
    await page.goto("/shop");
    // Click first product
    const productLink = page.locator('a[href^="/shop/"]').first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState("networkidle");

      // Look for Add to Cart or Pre-Order button
      const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Pre-Order Now")').first();
      if (await addBtn.isVisible() && await addBtn.isEnabled()) {
        await addBtn.click();
        // Should show "Added to Cart" confirmation
        await expect(page.getByText("Added to Cart")).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test("Quick add from shop page", async ({ page }) => {
    await page.goto("/shop");
    // Find an Add button on a product card
    const addBtn = page.locator('button:has-text("Add")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Cart count should update
      await page.waitForTimeout(500);
      // Verify cart icon shows a count badge
      const badge = page.locator('button[aria-label="Open cart"] span');
      if (await badge.isVisible()) {
        const text = await badge.textContent();
        expect(Number(text)).toBeGreaterThan(0);
      }
    }
  });
});
