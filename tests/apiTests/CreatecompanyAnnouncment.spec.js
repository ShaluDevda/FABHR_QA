import { test, expect } from "@playwright/test";
import { LoginPage } from "../utils/endpoints/classes/login.js";
import { CompanyAnnouncement } from "../utils/endpoints/classes/People/companyAnnouncement.js";
import loginExpected from "../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Company Announcement API Tests", () => {
  let token;

  const loginBody = {
    username: loginExpected.happy.loginName,
    password: "12345678",
  };

  // Base valid announcement data
  const baseAnnouncementData = {
    departmentId: [
      20, 21, 9, 10, 13, 22, 14, 2, 11, 7, 12, 3, 17, 1, 18, 4, 5, 8, 15, 16, 6,
      19,
    ],
    title: "Valid Announcement Title",
    dateFrom: "2025-09-01T07:19:54.000Z",
    dateTo: "2025-09-10T07:19:54.000Z",
    description: "Valid announcement description for testing purposes",
    userId: 369,
    companyId: 1,
    effectiveStartDate: "2025-09-01T07:19:54.000Z",
    effectiveEndDate: "2025-09-10T07:19:54.000Z",
    acticeStatus: "AC",
    userIdUpdate: 369,
  };

  test.beforeAll("Get authentication token", async ({ request }) => {
    const loginPage = new LoginPage();
    const loginResp = await loginPage.loginAs(request, loginBody);
    token = loginResp.body.token;
    expect(token).toBeTruthy();
  });

  test("Create company announcement with valid data", async ({ request }) => {
    const companyAnnouncement = new CompanyAnnouncement();
    const response = await companyAnnouncement.createAnnouncement(
      request,
      baseAnnouncementData,
      token
    );

    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
  });

  test.describe("Negative test cases for Field Validation Tests", () => {
    test("Missing title field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { title, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );
      expect(response.body.message).toContain("Conflict");
      expect([409, 500]).toContain(response.status);
    });

    test("Missing companyId field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { companyId, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );

      expect(response.body.message).toContain("Conflict");
      expect([409, 500]).toContain(response.status);
    });

    test("Missing userId field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { userId, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );
      expect([409, 500]).toContain(response.status);
    });

    test("Missing departmentId field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { departmentId, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );

      expect([409, 500]).toContain(response.status);
    });

    test("Missing dateFrom field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { dateFrom, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );

      expect([409, 500]).toContain(response.status);
    });

    test("Missing dateTo field should return 409 conflict or 500 error", async ({
      request,
    }) => {
      const { dateTo, ...invalidData } = baseAnnouncementData;
      const companyAnnouncement = new CompanyAnnouncement();
      const response = await companyAnnouncement.createAnnouncement(
        request,
        invalidData,
        token
      );

      expect([409, 500]).toContain(response.status);
    });
  });
});
