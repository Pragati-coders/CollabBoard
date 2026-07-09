import { test, expect } from "@playwright/test";

test.describe("Public Navigation", () => {
  test("landing page has all key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("CollabBoard")).toBeVisible();
    await expect(page.getByText("Get started")).toBeVisible();
    await expect(page.getByText("Features")).toBeVisible();
  });

  test("nav links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/sign-in/);
  });
});
