import { test, expect } from "@playwright/test";

// Note: these tests require a seeded test account
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD in your .env.test

test.describe("Kanban Board", () => {
  test.beforeEach(async () => {
    // Skip in CI unless credentials are provided
    test.skip(!process.env.TEST_USER_EMAIL, "No test credentials");
  });

  test("board page loads with columns", async ({ page }) => {
    await page.goto("/dashboard/board/test-board-id");
    await expect(page.getByText("Todo")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("Review")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();
  });

  test("can add a new card", async ({ page }) => {
    await page.goto("/dashboard/board/test-board-id");
    await page.getByRole("button", { name: "Add card" }).first().click();
    await page.getByPlaceholder("Card title...").fill("Test Card");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Test Card")).toBeVisible();
  });
});
