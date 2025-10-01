import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/leavePeriod/status/1, get find grade List", () => {
  let authToken, response;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
      password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    ExpectResponse.okResponse(loginResponse.status);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("Get Leave  Period  list - Happy flow @happy @medium", async ({ request }) => {
    const leave = new Leave();
    response = await leave.getLeavePeriod(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    const item = response.body[0];
    expect(item).toHaveProperty("leavePeriodName", "Jan2021-Dec2021");
    expect(item).toHaveProperty("startDate", 1609439400000);
    expect(item).toHaveProperty("userId", 1);
    expect(item).toHaveProperty("companyId", 1);
    expect(item).toHaveProperty("userIdUpdate", null);
    expect(item).toHaveProperty("session", null);
    expect(item).toHaveProperty("nonMergeIds", null);
  });
});
