import { test, expect } from "@playwright/test";
import { LoginPage } from "../utils/endpoints/classes/login.js";
import loginExpected from "../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Logout API", () => {
  test("Happy Path: Valid logout after login", async ({ request }) => {
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
      password: "12345678",
    };

    const loginResp = await loginPage.loginAs(request, loginBody);
    expect(loginResp.status).toBe(200);
    expect(loginResp.token).toBeTruthy();

    const logoutResponse = await loginPage.logout(request);
    expect([200]).toContain(logoutResponse.status);
    expect(logoutResponse.body).toBeTruthy();
  });
});