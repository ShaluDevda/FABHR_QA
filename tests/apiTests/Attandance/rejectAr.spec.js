import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };
import rejectPayload from "../../fixtures/payloads/rejectAndApproveAr.json" assert { type: "json" };
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

  test.only("Apply AR and Reject-  Success scenario  @happy", async ({ request }) => {
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    const maxAttempts = 29;
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
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    console.log(response);
    const responseBody = response.body;

    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
  //reject AR payload
 const Payload={
    ...rejectPayload.rejectApproveAr,
    arID: responseBody.data.arID,
    arCategory: responseBody.data.arCategory,
    days: responseBody.data.days,
    fromDate: responseBody.data.fromDate,
    toDate: responseBody.data.toDate,
    employeeRemark: responseBody.data.employeeRemark,
    status: "REJ",
    reviewerRemark: "Rejecting for testing purpose",
    approvalId: responseBody.data.approvalId,
    companyId: responseBody.data.companyId,
    companyIdUpdate: responseBody.data.companyIdUpdate,
    userIdUpdate: responseBody.data.userIdUpdate,
    userId: responseBody.data.userId,
    employeeId: responseBody.data.employeeId
  }
    //reject AR
 console.log("rejectsdfghjk"+ JSON.stringify(Payload));
   let rejectResponse = await attendance.applyAR(request,Payload, authToken);
   console.log(rejectResponse);
   expect(rejectResponse.status).toBe(200);
   expect(rejectResponse.body.statusCode).toBe(200);
   expect(rejectResponse.body.isSuccess).toBe(true);
   expect(rejectResponse.body.message).toBe("Data Found Successfully");
  });
  test("Apply AR and Approve-  Success scenario  @happy", async ({ request }) => {
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    const maxAttempts = 19;
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
      console.log(dynamicPayload)
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    console.log(response);
    const responseBody = response.body;

    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
  //reject AR payload
 const Payload={
    ...rejectPayload.rejectApproveAr,
    arID: responseBody.data.arID,
    arCategory: responseBody.data.arCategory,
    days: responseBody.data.days,
    fromDate: responseBody.data.fromDate,
    toDate: responseBody.data.toDate,
    employeeRemark: responseBody.data.employeeRemark,
    status: "APR",
    reviewerRemark: "Approve for testing purpose",
    approvalId: responseBody.data.approvalId,
    companyId: responseBody.data.companyId,
    companyIdUpdate: responseBody.data.companyIdUpdate,
    userIdUpdate: responseBody.data.userIdUpdate,
    userId: responseBody.data.userId,
    employeeId: responseBody.data.employeeId
  }
    //Approval AR
 console.log("approve"+ JSON.stringify(Payload));
   let rejectResponse = await attendance.applyAR(request,Payload, authToken);
   console.log(rejectResponse);
   expect(rejectResponse.status).toBe(200);
   expect(rejectResponse.body.statusCode).toBe(200);
   expect(rejectResponse.body.isSuccess).toBe(true);
   expect(rejectResponse.body.message).toBe("Data Found Successfully");
  });

 



  
});
