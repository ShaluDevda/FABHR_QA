import { test, expect } from "@playwright/test";
import { LoginPage } from "../utils/endpoints/classes/login.js";
import loginExpected from "../fixtures/Response/loginExpected.json" assert { type: "json" };

// Reusable login body template
const loginBody = {
  "username": loginExpected.happy.loginName,
  "password": "12345678",
};

test("login API test (happy flow)", async ({ request }) => {
  const loginPage = new LoginPage();
  const response = await loginPage.loginAs(request, loginBody);
  const body = typeof response.body === "object" ? response.body : await response.json();

  expect(response.status).toBe(loginExpected.happy.status);
  expect(body).toHaveProperty("token");
  expect(body.token).toBeDefined();
  expect(body.message).toBe(loginExpected.happy.message);
  expect(body.employeeCode).toBe(loginExpected.happy.employeeCode);
  expect(body.roles[0]).toBe(loginExpected.happy.roles[0]);
  expect(body.userId).toBe(loginExpected.happy.userId);
  expect(body.employeeId).toBe(loginExpected.happy.employeeId);
  expect(body.loginName).toBe(loginExpected.happy.loginName);
  expect(body.emailOfUser).toBe(loginExpected.happy.emailOfUser);

});

// --- Negative scenarios --- 
const negativeCases = loginExpected.negative.map((item) => ({
  ...item,
  expectedRegex: item.expectedRegex ? new RegExp(item.expectedRegex) : undefined
}));

test.describe('Negative login (API)', () => {
  const loginPage = new LoginPage();
  for (const { username, password, status, expected, expectedRegex } of negativeCases) {
    test(`login(${username}, ${password}) returns error`, async ({ request }) => {
      const testLoginBody = { ...loginBody, username: username, password: password };
      const responseObj = await loginPage.loginAs(request, testLoginBody);

      expect(responseObj.status).toBe(status);

      if (expectedRegex) {
        expect(responseObj.body.message).toMatch(expectedRegex);
      } else {
        expect(responseObj.body.message).toContain(expected);
      }
    });
  }
});
