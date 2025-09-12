import { test, expect } from '@playwright/test';
import { LoginPage } from "../../Pages/loginPage"

test.describe("Checkout and checkin ",()=>{
    test.describe.configure({ timeout: 30_000 });

  let loginPage;

  test.beforeEach(async ({ page }) => {
     loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Checkin and check the time", async({page})=>{
    await loginPage.login('FABHR-537-fabhrdemo.in', '12345678');
 


    
  })

});