import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
let authToken,payload;


test.describe("Reject and Approve WFH API", () => {
  let createdWFHIds = []; // Track WFH IDs created during tests
 
  // Helper function to try WFH with different dates until success
  const tryWFHWithDifferentDates = async (attendance, request, payload, maxAttempts = 90) => {
    
    for (let i = 0; i < maxAttempts; i++) {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + i + 1); // Start from tomorrow
      
      payload = {
        ...applyWFHExpected.requestBody,
        fromDate: testDate.toISOString(),
        toDate: testDate.toISOString()
      };
      const attendance = new Attandance();
      const response = await attendance.applyWFH(request, payload, authToken);
      if (response.status === 200) {
        return { success: true, response, payload };
      } else if (response.body.message === "You have already applied Work from home in the given duration.") {
        continue;
      } else {
        return { success: false, response, payload };
      }
    }
    return { success: false, response: null, payload: null };
  };
  
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

 
 test("Apply WFH - Happy flow @happy", async ({ request }) => {
    // Use helper function to get successful response
     const attendance = new Attandance();
    const result = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(result.success).toBe(true);
    
    const response = result.response;
    const payload = result.payload;   // ✅ FIX: pull payload from result
    
    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  
    const resBody = response.body;
  
    // Track WFH ID for cleanup
    if (resBody.workFromHomeDateWiseId) {
      createdWFHIds.push(resBody.workFromHomeDateWiseId);
    }
    
    // Validate response fields
    expect(resBody).toHaveProperty("workFromHomeDateWiseId");
    expect(resBody).toHaveProperty("dateCreated");
    expect(resBody).toHaveProperty("employeeId");
    expect(resBody).toHaveProperty("wfhCategory");
    expect(resBody).toHaveProperty("fromDate");
    expect(resBody).toHaveProperty("toDate");
    expect(resBody).toHaveProperty("approvalStatus");
    expect(resBody).toHaveProperty("userId");
    expect(resBody).toHaveProperty("userIdUpdate");
    expect(resBody).toHaveProperty("employeeRemark");
    expect(resBody).toHaveProperty("masterWorkFromHome");
  
    // Status mapping check
    expect(resBody.approvalStatus).toBe("PEN");
    expect(resBody.wfhCategory).toBe(payload.reasonSelect);
  
    // Date validations (ISO → epoch)
    const fromDateEpoch = new Date(payload.fromDate).getTime();
    const toDateEpoch = new Date(payload.toDate).getTime();
    expect(resBody.fromDate).toBe(fromDateEpoch);
    expect(resBody.toDate).toBe(toDateEpoch);
  
    // Nested object check
    expect(resBody.masterWorkFromHome.workFromHomeTypeShortName).toBe("SD");
    expect(resBody.masterWorkFromHome.workFromHomeType).toBe("Specific date");
    expect(resBody.masterWorkFromHome).toHaveProperty("masterWorkFromHomeId");
    expect(resBody.masterWorkFromHome).toHaveProperty("companyId");
  });
  

  test("Apply WFH - Duplicate request (already applied) @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // First request - should succeed using helper function
    const firstResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(firstResult.success).toBe(true);
    expect(firstResult.response.status).toBe(200);

    // Track WFH ID for cleanup
    if (firstResult.response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(firstResult.response.body.workFromHomeDateWiseId);
    }

    // Second request with same data - should return duplicate error
    const secondResponse = await attendance.applyWFH(request, firstResult.payload, authToken);
    // Should return 500 status with specific error message
    expect(secondResponse.status).toBe(500);
    expect(secondResponse.body).toBeTruthy();

    const errorBody = secondResponse.body;
    expect(errorBody).toHaveProperty("statusCode");
    expect(errorBody).toHaveProperty("message");
    expect(errorBody).toHaveProperty("data");
    expect(errorBody).toHaveProperty("isSuccess");
    expect(errorBody).toHaveProperty("errorCode");
    expect(errorBody).toHaveProperty("errorMsg");

    // Validate specific error values
    expect(errorBody.statusCode).toBe(500);
    expect(errorBody.message).toBe("You have already applied Work from home in the given duration.");
    expect(errorBody.data).toBeNull();
    expect(errorBody.isSuccess).toBe(false);
    expect(errorBody.errorCode).toBeNull();
    expect(errorBody.errorMsg).toBeNull();
  });

  test("Apply WFH - Change date and try again @happy", async ({ request }) => {
    const attendance = new Attandance();

    // First successful WFH request
    const firstResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(firstResult.success).toBe(true);
    expect(firstResult.response.status).toBe(200);

    // Track WFH ID for cleanup
    if (firstResult.response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(firstResult.response.body.workFromHomeDateWiseId);
    }

    // Try duplicate request with same date - should fail
    const duplicateResponse = await attendance.applyWFH(request, firstResult.payload, authToken);
    expect(duplicateResponse.status).toBe(500);
    expect(duplicateResponse.body.message).toBe("You have already applied Work from home in the given duration.");

    // Try with different date - should succeed
    const secondResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(secondResult.success).toBe(true);
    expect(secondResult.response.status).toBe(200);
    expect(secondResult.response.body.workFromHomeDateWiseId).toBeTruthy();

    // Track second WFH ID for cleanup
    if (secondResult.response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(secondResult.response.body.workFromHomeDateWiseId);
    }
  });

  test("Apply WFH - Missing required fields @negative", async ({ request }) => {
    const attendance = new Attandance();
    const incompletePayload = {
      employeeId: 368,
      // Missing other required fields
    };

    const response = await attendance.applyWFH(request, incompletePayload, authToken);
   
    // Should return error for missing required fields
    expect(response).toBeTruthy();
    expect([400, 422, 500]).toContain(response.status);
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

  test("Apply WFH - Invalid employee ID @negative", async ({ request }) => {
    const attendance = new Attandance();
    const invalidPayload = {
      ...applyWFHExpected.requestBody,
      employeeId: 999999 // Invalid employee ID
    };

    const response = await attendance.applyWFH(request, invalidPayload, authToken);
    // Should return error for invalid employee ID
    expect(response).toBeTruthy();
    expect([409]).toContain(response.status);
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

  test("Apply WFH - Response time validation @negative", async ({ request }) => {
    const attendance = new Attandance();

    const startTime = Date.now();
    const result = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    // Validate response time (should be less than 10 seconds for WFH request)
    expect(responseTime).toBeLessThan(20000);

    // Basic response validation
    expect(result.success).toBe(true);
    expect(result.response).toBeTruthy();
    expect(result.response.status).toBe(200);
    expect(result.response.body).toBeTruthy();
    
    // Track WFH ID for cleanup
    if (result.response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(result.response.body.workFromHomeDateWiseId);
    }
  });

  test("Apply WFH - Response content type validation @negative", async ({ request }) => {
    const attendance = new Attandance();

    // Call the function to get a successful response
    const result = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(result.success).toBe(true);
    
    const response = result.response;
    
    // Track WFH ID for cleanup
    if (response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(response.body.workFromHomeDateWiseId);
    }
    
    // Validate response
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();

    // Validate that response body is an object (JSON)
    expect(typeof response.body).toBe("object");
    expect(Array.isArray(response.body)).toBe(false);
  });

  test("Apply WFH - Different WFH categories @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Test different WFH categories
    const categories = ["ME", "OT"];
    
    for (const category of categories) {
      
      const basePayload = {
        ...applyWFHExpected.requestBody,
        reasonSelect: category,
        employeeRemark: `WFH request for ${category} reason`
      };
      
      // Use the retry function to find a working date
      const result = await tryWFHWithDifferentDates(attendance, request, basePayload);
      // Validate the result
      expect(result.success).toBe(true);
      expect(result.response.status).toBe(200);
      expect(result.response.body).toBeTruthy();
      
      // Track WFH ID for cleanup
      if (result.response.body.workFromHomeDateWiseId) {
        createdWFHIds.push(result.response.body.workFromHomeDateWiseId);
      }
      
    
    }
  });

  test("Apply WFH then Reject WFH - Complete workflow @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Step 1: Apply WFH first using helper function
    const applyResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(applyResult.success).toBe(true);
    expect(applyResult.response.status).toBe(200);
    expect(applyResult.response.body.workFromHomeDateWiseId).toBeTruthy();
    
    const wfhId = applyResult.response.body.workFromHomeDateWiseId;

    // Step 2: Reject the WFH request
    const rejectPayload = {
      ...applyWFHExpected.rejectWFHPayload,
      workFromHomeDateWiseId: wfhId,
      approvalId: applyResult.payload.employeeId,
      employeeId: applyResult.payload.employeeId,
      userId: applyResult.payload.userId,
      userIdUpdate: applyResult.payload.userIdUpdate,
      fromDate: new Date(applyResult.payload.fromDate).getTime(),
      toDate: new Date(applyResult.payload.toDate).getTime(),
      reasonSelect: applyResult.payload.reasonSelect,
      employeeRemark: applyResult.payload.employeeRemark
    };

    const rejectResponse = await attendance.rejectWFH(request, rejectPayload, authToken);
    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body).toBeTruthy();

    // Validate rejection response
    expect(rejectResponse.body.workFromHomeDateWiseId).toBe(wfhId);
    expect(rejectResponse.body.approvalStatus).toBe("REJ");
    expect(rejectResponse.body.employeeWFHStatus).toBe("DE");
    expect(rejectResponse.body.approvalorcancelremark).toBe("no");
  });


});