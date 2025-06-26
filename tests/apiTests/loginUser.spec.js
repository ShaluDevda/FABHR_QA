import { test , expect } from "@playwright/test";
import { LoginPage } from "../utils/endpoints/classes/login.js";

test("login API test", async ({ request }) => {
  const loginPage = new LoginPage();
  const loginBody = {
    "username": "FABHR-72-fabhrdemo.in",
    "password": "12345678",
  };
  const response = await loginPage.loginAs(request, loginBody);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
  expect(response.body.token).toBeDefined();
  expect(response.body.message).toBe("success");
  expect(response.body.employeeCode).toBe("FABHR-72");
  expect(response.body.roles[0]).toBe("Admin");
  expect(response.body.userId).toBe(72);
  expect(response.body.employeeId).toBe(71);
  expect(response.body.loginName).toBe(loginBody.username);
  expect(response.body.emailOfUser).toBe("sachin.saxena@computronics.in");
  // expect(response.body.message).toBe("Login successful");
  console.log("Login successful:", response.body);

});
