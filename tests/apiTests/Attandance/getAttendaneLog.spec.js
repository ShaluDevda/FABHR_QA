import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import getAttandanceLog from "../../fixtures/payloads/getAttandanceLog.json" assert { type: "json" };
let response;
test.describe("Time & Attendance>Attendance get Attendane Log", () => {
  let authToken;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });
  test("POST get Attendane Log - Happy flow @happy @medium", async ({ request }) => {
    const attendance = new Attandance();

    response = await attendance.getAttendaneLog(
      request,
      getAttandanceLog.getAttandanceLogPayload,
      authToken
    );
    const responseBody = response.body;
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody).toHaveProperty("currentPage");
    expect(responseBody).toHaveProperty("totalItems");
    expect(responseBody).toHaveProperty("totalPages");

    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(typeof responseBody.currentPage).toBe("number");
    expect(typeof responseBody.totalItems).toBe("number");
    expect(typeof responseBody.totalPages).toBe("number");

    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
  
  });
});
