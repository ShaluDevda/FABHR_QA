import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Time & Attendance>Attendance findAllPreviousMonthWithCurrent", () => {
  let authToken;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
      password: "12345678",
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("GET findAllPreviousMonthWithCurrent - Happy flow @happy", async ({ request }) => {
    const attendance = new Attandance();
    const response = await attendance.findAllPreviousMonthWithCurrent(request, authToken);
       expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Validate that months are in the expected format (e.g., 'Sep-2025')
    for (const month of response.body) {
      expect(month).toMatch(/^[A-Za-z]{3}-\d{4}$/);
    }
    // Validate that current month is present
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).replace(',', '').replace(' ', '-');
    expect(response.body).toContain(currentMonth);
  });

  test("GET findAllPreviousMonthWithCurrent - Response not empty", async ({ request }) => {
    const attendance = new Attandance();
    const response = await attendance.findAllPreviousMonthWithCurrent(request, authToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

