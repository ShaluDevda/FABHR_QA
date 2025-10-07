import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Organization } from "../../utils/endpoints/classes/settings/Organization.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("DELETE| /hrmsApi/branch/delete/{branchId}, Delete Branch", () => {
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

  test("Delete Branch  - Happy flow @happy @medium", async ({ request }) => {
  const organization = new Organization();
  response = await organization.getFindBranchList(request, authToken);
  expect(response).toBeTruthy();
  // Get the branchId and branchName of the first branch
  const branchId = response.body[0].branchId;
  // Delete the branch
  response = await organization.deleteBranch(request, authToken, branchId);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);
  // After delete, validate the branch is not in the list
  response = await organization.getFindBranchList(request, authToken);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);
  // Check that the deleted branch name is not present
  const branchList = response.body;
  const branchIdValidation = branchList.map(branch => branch.branchId);
    expect(branchIdValidation).not.toContain(branchId);
  });

});
