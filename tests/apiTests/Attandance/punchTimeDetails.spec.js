import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { PunchTime } from "../../utils/endpoints/classes/attandance/punchTime.js";
import { ResponseValidator } from "../../utils/validation/responseValidator.js";

import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import { json } from "stream/consumers";

test.describe("Punch Time Details GET API", () => {
  let token;
  const loginBody = {
    username: loginExpected.happy.loginName,
    password: "12345678",
  };

  // Test data
  const validEmployeeCode = loginExpected.happy.loginName;
  const validCompanyId = 1;
  const invalidEmployeeCode = "INVALID-999-fabhrdemo.in";
  const invalidCompanyId = 999;

  test.beforeEach("Get authentication token", async ({ request }) => {
    const loginPage = new LoginPage();
    const loginResp = await loginPage.loginAs(request, loginBody);
    token = loginResp.body.token;
    expect(token).toBeTruthy();
  });

  test("Get punch time details - Happy flow", async ({ request }) => {
    const punchTime = new PunchTime();

    const response = await punchTime.getPunchTimeDetails(
      request,
      token,
      validEmployeeCode,
      validCompanyId
    );
    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();

    // Validate response structure
    if (response.body && typeof response.body === "object") {
      // Check for expected fields in the response
      expect(response.body).toHaveProperty("punchTimeDetailsId");
      expect(response.body).toHaveProperty("date");
      expect(response.body).toHaveProperty("time");
      expect(response.body).toHaveProperty("in_out");
      expect(response.body).toHaveProperty("employeeId");
      expect(response.body).toHaveProperty("companyId");

      // Validate time format (should be in HH:MM:SS format)
      if (response.body.time) {
        expect(typeof response.body.time).toBe("string");
        expect(response.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      }

      // Validate in_out field
      if (response.body.in_out) {
        expect(["in", "out", "ou"]).toContain(response.body.in_out);
      }

      // Validate employee ID if present
      if (response.body.employeeId) {
        expect(typeof response.body.employeeId).toBe("number");
      }

      // Validate company ID if present
      if (response.body.companyId) {
        expect(typeof response.body.companyId).toBe("number");
      }
    }
  });
  test("Get punch time details - Without username header", async ({
    request,
  }) => {
    const punchTime = new PunchTime();

    const response = await punchTime.getPunchTimeDetailsWithoutUsername(
      request,
      token,
      validEmployeeCode,
      validCompanyId
    );

    // Should return error for missing username header
    expect(response).toBeTruthy();
    expect([400, 401, 403]).toContain(response.status);
    expect(response.body).toBeTruthy();

    // Validate error response structure
    if (response.body && typeof response.body === "object") {
      if (response.body.hasOwnProperty("isSuccess")) {
        expect(response.body.isSuccess).toBe(false);
      }

      if (response.body.hasOwnProperty("message")) {
        expect(typeof response.body.message).toBe("string");
      }
    }
  });

  test("Get punch time details - Invalid company ID", async ({ request }) => {
    const punchTime = new PunchTime();

    const response = await punchTime.getPunchTimeDetailsWithInvalidCompany(
      request,
      token,
      validEmployeeCode,
      invalidCompanyId
    );

    // Should return 200 status code with null values for invalid company ID
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();

    // Validate response structure with null values
    if (response.body && typeof response.body === "object") {
      // Check for expected fields in the response
      expect(response.body).toHaveProperty("punchTimeDetailsId");
      expect(response.body).toHaveProperty("date");
      expect(response.body).toHaveProperty("time");
      expect(response.body).toHaveProperty("in_out");
      expect(response.body).toHaveProperty("employeeId");
      expect(response.body).toHaveProperty("companyId");

      // Validate that time and in_out should be null for invalid company ID
      expect(response.body.time).toBeNull();
      expect(response.body.in_out).toBeNull();

      // Other fields might also be null
      expect(response.body.punchTimeDetailsId).toBeNull();
      expect(response.body.date).toBeNull();
      expect(response.body.employeeId).toBeNull();
      expect(response.body.companyId).toBeNull();
    }
  });

  test("Get punch time details - Response time validation", async ({
    request,
  }) => {
    const punchTime = new PunchTime();

    const startTime = Date.now();
    const response = await punchTime.getPunchTimeDetails(
      request,
      token,
      validEmployeeCode,
      validCompanyId
    );
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time (should be less than 5 seconds)
    expect(responseTime).toBeLessThan(5000);

    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  test("Get punch time details - Response content type validation", async ({
    request,
  }) => {
    const punchTime = new PunchTime();

    const response = await punchTime.getPunchTimeDetails(
      request,
      token,
      validEmployeeCode,
      validCompanyId
    );

    // Validate response
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();

    // Validate that response body is an object (JSON)
    expect(typeof response.body).toBe("object");
    expect(Array.isArray(response.body)).toBe(false);
  });

  test("Get punch time details - Multiple requests consistency", async ({
    request,
  }) => {
    const punchTime = new PunchTime();

    // Make multiple requests to check consistency
    const responses = [];
    for (let i = 0; i < 3; i++) {
      const response = await punchTime.getPunchTimeDetails(
        request,
        token,
        validEmployeeCode,
        validCompanyId
      );
      responses.push(response);
    }

    // All responses should be successful
    responses.forEach((response, index) => {
      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    // All responses should have the same structure
    const firstResponse = responses[0];
    responses.forEach((response, index) => {
      if (index > 0) {
        // Compare structure (not values, as time might change)
        expect(Object.keys(response.body)).toEqual(
          Object.keys(firstResponse.body)
        );
      }
    });
  });
});
