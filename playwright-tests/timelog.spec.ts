import { test, expect } from "@playwright/test";

test.describe("Timelog Page", () => {
  test("should load unreported tab by default", async ({ page }) => {
    await page.goto("/timelog");

    // Expect heading
    await expect(page.getByRole("heading", { name: "Time Log" })).toBeVisible();

    // Check if Unreported tab is active
    const unreportedTab = page.getByRole("tab", { name: "Unreported" });
    await expect(unreportedTab).toHaveAttribute("data-state", "active");

    // Optional: wait for table or empty view
    await expect(
      page.locator("text=No time logs found"), // Adjust based on your actual empty state text
    ).toBeVisible();
  });

  test("can switch to reported tab", async ({ page }) => {
    await page.goto("/timelog");

    await page.getByRole("tab", { name: "Reported" }).click();
    await expect(page.getByRole("tab", { name: "Reported" })).toHaveAttribute("data-state", "active");

    // Wait for calendar or date picker to appear
    await expect(page.locator("text=Pick a date range")).toBeVisible();
  });
});
