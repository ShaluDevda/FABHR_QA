// tests/dashboard.spec.js
import { test, expect } from '@playwright/test';
const { DashboardPage } = require("../Pages/DashboardPage");
import { LoginPage } from "../Pages/loginPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto("https://hrms.fabhr.in/hrms/#/");
  await loginPage.login('FABHR-537-fabhrdemo.in', '12345678'); // Replace with valid credentials
  // Optionally, verify you are on the dashboard
  await expect(page).toHaveURL(/.*\/hrms\/#\//);
});

test("Dashboard UI loads correctly", async ({ page }) => {
  
})

