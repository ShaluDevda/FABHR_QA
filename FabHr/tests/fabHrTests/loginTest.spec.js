import { test, expect } from "@playwright/test";
import { LoginPage } from "../Pages/loginPage";
import { ROUTES, BASE_URL } from "../utils/routes";
import { decodeBase64 } from "../utils/crypto";

test.describe("Login", () => {
  test.describe.configure({ timeout: 30_000 });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate(BASE_URL, ROUTES.login);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  test("Login with valid username and password", async ({ page }) => {
    await loginPage.login("T-103-test.in", "12345678");

    const dashboard = page.locator("//span[normalize-space()='Dashboard']");

    // 1. Wait for it to appear
    await dashboard.waitFor({ state: "visible", timeout: 10_000 });

    // 2. Assert it’s visible
    await expect(dashboard).toBeVisible();
 

    // 3. Assert it has exactly the text "Dashboard"
    await expect(dashboard).toHaveText("Dashboard");

    // 4. Get the current URL
    const currentUrl = page.url();
    console.log(currentUrl);
    // 5. Extract the Base64-encoded part from the URL
    const encodedPart = currentUrl.split("/").pop(); // Get the last part of the URL
    console.log(encodedPart);
    // 6. Decode the Base64-encoded part
    const decodedValue = decodeBase64(encodedPart);

    // 7. Assert the decoded value
    expect(decodedValue).toBe("dashboard");

    // 8. Assert it has exactly the text "Dashboard"
    await expect(dashboard).toHaveText("Dashboard");
  });

  // ─────────────────────────────────────────────────────────────────────────────
  const negativeCases = [
    {
      user: "T-10",
      pass: "123",
      // your “incorrect username” banner lives in this <p>
      selector: "//p[@class='loginError login-errorT']",
      expected: "You have entered incorrect username.",
    },
    {
      user: "T-10",
      pass: "12345678",
      selector: "//p[@class='loginError login-errorT']",
      expected: "You have entered incorrect username.",
    },
    {
      user: "T-103-test.in",
      pass: "0",
      selector: "//p[@class='loginError login-errorT']",
      // dynamic password-attempt message
      expectedRegex:
        /^\s*(?:Incorrect password .* \d+ unsuccessful attempt's out of 5 allowed attempts\.|Error! User Blocked)\s*$/,
    },
  ];

  test.describe("Negative login", () => {
    for (const {
      user,
      pass,
      selector,
      expected,
      expectedRegex,
    } of negativeCases) {
      test(`login(${user}, ${pass}) shows error`, async ({ page }) => {
        await loginPage.login(user, pass);

        const banner = page.locator(selector);
        // wait for that particular banner to appear
        await banner.waitFor({ state: "visible", timeout: 5_000 });

        if (expectedRegex) {
          await expect(banner).toHaveText(expectedRegex);
        } else {
          await expect(banner).toContainText(expected);
        }
      });
    }
  });
});
