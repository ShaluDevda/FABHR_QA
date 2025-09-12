import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";

import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Get All Checkin Detail", ()=>{
    let token;
    const loginBody = {
        username: loginExpected.happy.loginName,
        password: "12345678",
      };

      test("Get authentication token", async ({ request }) => {
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
          
        //   expect(response).toBeTruthy();
        //   expect(response.status).toBe(200);



    })
    
})