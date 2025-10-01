import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import { ResponseValidator } from "../../utils/validation/responseValidator.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Get All Checkin Detail", () => {
  let token;
  const loginBody = {
    username: loginExpected.happy.loginName,
       password: loginExpected.happy.password,
  };

  test.beforeEach("GET |-hrmsApi/attendanceLog/getAllCheckInDetails/emp/368  Get authentication token", async ({ request }) => {
    const loginPage = new LoginPage();
    const loginResp = await loginPage.loginAs(request, loginBody);
    token = loginResp.body.token;
    expect(token).toBeTruthy();
  });

  test("Get all checkin data @happy @medium", async ({ request }) => {
    const getAllCheckinDetails = new Attandance();
    const response = await getAllCheckinDetails.getAllCheckinDetails(
      request,
      token
    );

    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(Array.isArray(response.body)).toBe(true);

    // Validate response structure using common validator
    const validationResult = ResponseValidator.validateAttendanceResponse(
      response,
      200
    );
    expect(validationResult.isValid).toBe(true);

    // Additional specific assertions
    if (response.body.length > 0) {
      const firstRecord = response.body[0];

      // Validate first record structure
      expect(firstRecord).toHaveProperty("empId");
      expect(firstRecord).toHaveProperty("userName");
      expect(firstRecord).toHaveProperty("checkInTime");
      expect(firstRecord).toHaveProperty("in_out");
      expect(firstRecord).toHaveProperty("modeCode");
      expect(firstRecord).toHaveProperty("date");

      // Validate data types
      expect(typeof firstRecord.empId).toBe("number");
      expect(typeof firstRecord.userName).toBe("string");
      expect(typeof firstRecord.checkInTime).toBe("string");
      expect(typeof firstRecord.date).toBe("number");

      // Validate specific values
      expect(firstRecord.empId).toBe(368);
      expect(firstRecord.userName).toBe("FABHR-537");
      expect(["in", "out", "ou"]).toContain(firstRecord.in_out);
      expect(["W", "M", "A"]).toContain(firstRecord.modeCode);

      // Validate time format (should contain AM/PM)
      expect(firstRecord.checkInTime).toMatch(/\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i);
    }
  });

  test("Get all checkin data - Negative scenario without username @negative @medium", async ({
    request,
  }) => {
    const getAllCheckinDetails = new Attandance();
    const response =
      await getAllCheckinDetails.getAllCheckinDetailsWithoutUsername(
        request,
        token
      );
    // Validate error response structure
    expect(response).toBeTruthy();
    
    // Specific error response assertions
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("isSuccess");
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body).toHaveProperty("errorMsg");
    
    // Validate error response values
    ExpectResponse.forbiddenRequest(response.status);
    ExpectResponse.invalidAccess(response.body.message);
    expect(response.body.data).toBeNull();
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.errorCode).toBeNull();
    expect(response.body.errorMsg).toBeNull();
  });

   test("Get all checkin data - Negative scenario without tenantid and token @negative @medium", async ({
    request,
  }) => {
    const getAllCheckinDetails = new Attandance();
    const response =
      await getAllCheckinDetails.getAllCheckinDetailsWithouttenantid(
        request
      );
    // Validate error response structure
    expect(response).toBeTruthy();
    
    // Specific error response assertions
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("isSuccess");

    // Validate error response values
    ExpectResponse.unauthorizedRequest(response.status);
    ExpectResponse.inCorrectUsername(response.body.message);
    expect(response.body.data).toBeNull();
    expect(response.body.isSuccess).toBe(false);
   
  });
});
