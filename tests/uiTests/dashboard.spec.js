// tests/dashboard.spec.js
const { test, expect } = require("@playwright/test");
const { DashboardPage } = require("../Pages/DashboardPage");
import { LoginPage } from "../Pages/loginPage";
import { ROUTES, BASE_URL } from "../utils/routes";

test.fail("Dashboard UI loads correctly", async ({ page }) => {
  const dashboard = new DashboardPage(page);

  // Navigate to the dashboard
  let loginPage = new LoginPage(page);
  await loginPage.navigate(BASE_URL, ROUTES.login);

  // Check that the correct URL is loaded
  await expect(page).toHaveURL(/.*hrms/);

  // Validate that birthday counter is visible
  await dashboard.validateCountersVisible();

  // Validate announcement section is visible
  await expect(dashboard.announcementSection).toBeVisible();

  // Click on Quick Action button
  await dashboard.openQuickAction();
});
