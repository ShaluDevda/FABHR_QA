import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };

test.describe("Apply AR (Attendance Regularization) API", () => {
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
    expect(loginResponse.token).toBeTruthy();
    authToken = loginResponse.token;
  });

  test.only("Apply AR -  Success scenario  @happy", async ({ request }) => {
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    const maxAttempts = 20;
    do {
       // Generate a new date for each attempt (today + attempts days)
    const date = new Date();
    date.setDate(date.getDate() + attempts);
    date.setHours(0, 0, 0, 0);
    const isoDate = date.toISOString();
    const dynamicPayload = {
      ...applyARExpected.requestBody,
      fromDate: isoDate,
      toDate: isoDate
    };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      console.log(response);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    const responseBody = response.body;
   
    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
    expect(responseBody.statusCode).toBe(applyARExpected.success.statusCode);
    expect(responseBody.message).toBe(applyARExpected.success.message);
    expect(responseBody.isSuccess).toBe(applyARExpected.success.isSuccess);
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data.arID).toBeDefined();
    expect(responseBody.data.arCategory).toBe(applyARExpected.requestBody.arCategory);
    expect(responseBody.data.days).toBe(applyARExpected.requestBody.days);
    expect(responseBody.data.employeeRemark).toBe(applyARExpected.requestBody.employeeRemark);
    expect(responseBody.data.status).toBe(applyARExpected.requestBody.status);
  });

  test("Apply AR - Already applied scenario @happy", async ({ request }) => {
    const attendance = new Attandance();
    // First apply AR
    const firstResponse = await attendance.applyAR(
      request,
      applyARExpected.requestBody,
      authToken
    );

    // If first request was successful, try to apply again for the same date range
    if (firstResponse.status === 200) {
      const secondResponse = await attendance.applyAR(
        request,
        applyARExpected.requestBody,
        authToken
      );
      const responseBody = secondResponse.body;

      expect(secondResponse.status).toBe(500);
      expect(responseBody.statusCode).toBe(applyARExpected.failure.statusCode);
      expect(responseBody.message).toBe(applyARExpected.failure.message);
      expect(responseBody.isSuccess).toBe(applyARExpected.failure.isSuccess);
      expect(responseBody.data).toBeNull();
    }
  });

  test("Apply AR - Invalid request body @negative", async ({ request }) => {
    const attendance = new Attandance();
    const invalidRequestBody = {
      ...applyARExpected.requestBody,
      arCategory: "", // Invalid empty category
      days: -1, // Invalid negative days
    };

    const response = await attendance.applyAR(
      request,
      invalidRequestBody,
      authToken
    );
    const responseBody = response.body;

    // Should return an error for invalid request
    expect(response.status).not.toBe(200);
    expect(responseBody.isSuccess).toBe(false);
  });

  test(
    "Apply AR - Without authentication token @negative",
    { tag: ["@negative"] },
    async ({ request }) => {
      const attendance = new Attandance();
      const response = await attendance.applyAR(
        request,
        applyARExpected.requestBody
      ); // No token passed
      const responseBody = response.body;

      // Should return an error for missing authentication
      expect(response.status).not.toBe(200);
      expect(responseBody.isSuccess).toBe(false);
    }
  );
});
