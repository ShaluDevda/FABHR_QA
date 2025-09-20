import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import { ResponseValidator } from "../../utils/validation/responseValidator.js";

import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Get All Checkin Detail", ()=>{
    let token;
    const loginBody = {
        username: loginExpected.happy.loginName,
        password: "12345678",
      };

      test.beforeEach("Get authentication token", async ({ request }) => {
        const loginPage = new LoginPage();
        const loginResp = await loginPage.loginAs(request, loginBody);
        token = loginResp.body.token;
        expect(token).toBeTruthy();
      });

    test("Get all checkin data", async({request})=>{
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
        const validationResult = ResponseValidator.validateAttendanceResponse(response, 200);
        expect(validationResult.isValid).toBe(true);

        // Additional specific assertions
        if (response.body.length > 0) {
            const firstRecord = response.body[0];
            
            // Validate first record structure
            expect(firstRecord).toHaveProperty('empId');
            expect(firstRecord).toHaveProperty('userName');
            expect(firstRecord).toHaveProperty('checkInTime');
            expect(firstRecord).toHaveProperty('in_out');
            expect(firstRecord).toHaveProperty('modeCode');
            expect(firstRecord).toHaveProperty('date');
            
            // Validate data types
            expect(typeof firstRecord.empId).toBe('number');
            expect(typeof firstRecord.userName).toBe('string');
            expect(typeof firstRecord.checkInTime).toBe('string');
            expect(typeof firstRecord.date).toBe('number');
            
            // Validate specific values
            expect(firstRecord.empId).toBe(368);
            expect(firstRecord.userName).toBe('FABHR-537');
            expect(['in', 'out', 'ou']).toContain(firstRecord.in_out);
            expect(['W', 'M', 'A']).toContain(firstRecord.modeCode);
            
            // Validate time format (should contain AM/PM)
            expect(firstRecord.checkInTime).toMatch(/\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i);
        }
    })

    test("Get all checkin data - Negative scenario without username", async({request})=>{
        const getAllCheckinDetails = new Attandance();
        const response = await getAllCheckinDetails.getAllCheckinDetailsWithoutUsername(
            request,
            token
          );
          
        // Validate error response structure
        expect(response).toBeTruthy();
        expect(response.status).toBe(403);
        expect(response.body).toBeTruthy();

        // Validate error response using common validator
        const validationResult = ResponseValidator.validateErrorResponse(response, 403);
        expect(validationResult.isValid).toBe(true);

        // Specific error response assertions
        expect(response.body).toHaveProperty('statusCode');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('isSuccess');
        expect(response.body).toHaveProperty('errorCode');
        expect(response.body).toHaveProperty('errorMsg');

        // Validate error response values
        expect(response.body.statusCode).toBe(403);
        expect(response.body.message).toBe('Invalid Access!!, Authentication Required');
        expect(response.body.data).toBeNull();
        expect(response.body.isSuccess).toBe(false);
        expect(response.body.errorCode).toBeNull();
        expect(response.body.errorMsg).toBeNull();

    })

  
})