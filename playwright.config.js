// @ts-check
const { defineConfig } = require("@playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 300000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 4,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright"],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  globalTimeout: 300000,
  maxFailures: process.env.CI ? 0 : 5,
  outputDir: "test-results/",
  testMatch: "**/*.{test,spec}.{js,ts}",
  testIgnore: "**/node_modules/**",

  use: {
    baseURL: process.env.CANONICAL_HOSTNAME || "https://hrms.fabhr.in/",
    headless: true,
    viewport: { width: 1920, height: 1080 },
    navigationTimeout: 80000,
    actionTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    ignoreHTTPSErrors: true,
    animations: "disabled",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "all-tests",
      testDir: "./tests",
    },
  ],
});
