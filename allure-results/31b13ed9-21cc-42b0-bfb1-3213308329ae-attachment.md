# Test info

- Name: Login >> Negative login >> login(T-103-test.in, 123456)
- Location: C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:46:11

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

Locator: getByRole('alert')
Expected pattern: /Incorrect password .* \d+ unsuccessful attempt's out of 5 allowed attempts\./
Received: <element(s) not found>
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for getByRole('alert')

    at C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:50:32
```

# Page snapshot

```yaml
- list:
  - listitem
- navigation:
  - link "FabHr":
    - /url: "#"
    - img "FabHr"
  - list:
    - listitem:  +91 9893569668
    - listitem:
      - text: 
      - link "info@fabhr.in":
        - /url: mailto:info@fabhr.in
- heading "Log in" [level=5]
- textbox "Username": T-103-test.in
- text: person
- textbox "Password": "123456"
- text: visibility_off
- paragraph: Incorrect password !! You have made 1 unsuccessful attempt's out of 5 allowed attempts.
- button "Log in"
- heading "Forgot Password?" [level=5]:
  - link "Forgot Password?":
    - /url: "#/forgetPassword"
- contentinfo:
  - link "":
    - /url: https://www.facebook.com/Fab-HR-Powered-by-Computronics-387601211728417/
  - link "":
    - /url: https://twitter.com/computronics_in
  - link "":
    - /url: https://www.linkedin.com/company/fabhr
  - list:
    - listitem:
      - link "Sitemap":
        - /url: "#"
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
    - listitem:
      - link "Terms of use":
        - /url: "#"
    - listitem:
      - link "FAQS":
        - /url: https://www.quora.com/profile/Computronics-System
    - listitem:
      - link "Contact Administrator":
        - /url: "#"
  - img "FabHr"
  - text: Powered by FabHr Solution Pvt Ltd. Version 3.0.37 (stable)
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { LoginPage }    from '../Pages/loginPage';
   3 | import { ROUTES }       from '../utils/routes';
   4 |
   5 | test.describe('Login', () => {
   6 |   test.describe.configure({ timeout: 30_000 });
   7 |
   8 |   let loginPage;
   9 |
  10 |   test.beforeEach(async ({ page }) => {
  11 |     loginPage = new LoginPage(page, ROUTES.login);
  12 |     await loginPage.goto();
  13 |   });
  14 |
  15 |   // ─────────────────────────────────────────────────────────────────────────────
  16 |   test('Login with valid username and password', async ({ page }) => {
  17 |     await loginPage.login('T-103-test.in', '12345678');
  18 |
  19 |     const dashboard = page.locator("//span[normalize-space()='Dashboard']");
  20 |
  21 |     // 1. Wait for it to appear
  22 |     await dashboard.waitFor({ state: "visible", timeout: 10_000 });
  23 |
  24 |     // 2. Assert it’s visible
  25 |     await expect(dashboard).toBeVisible();
  26 |
  27 |     // 3. Assert it has exactly the text "Dashboard"
  28 |     await expect(dashboard).toHaveText("Dashboard");
  29 |   });
  30 |
  31 |   // ─────────────────────────────────────────────────────────────────────────────
  32 |   // Data-driven negative scenarios
  33 |   const negativeCases = [
  34 |     { user: 'T-10',           pass: '123',      error: 'You have entered incorrect username.' },
  35 |     { user: 'T-10',           pass: '12345678', error: 'You have entered incorrect username.' },
  36 |     {
  37 |       user:  'T-103-test.in',
  38 |       pass:  '123456',
  39 |       // match "Incorrect password !! You have made 2 unsuccessful attempt's…"
  40 |       regex: /Incorrect password .* \d+ unsuccessful attempt's out of 5 allowed attempts\./
  41 |     },
  42 |   ];
  43 |
  44 |   test.describe('Negative login', () => {
  45 |     for (const { user, pass, error, regex } of negativeCases) {
  46 |       test(`login(${user}, ${pass})`, async ({ page }) => {
  47 |         await loginPage.login(user, pass);
  48 |         const banner = page.getByRole('alert');
  49 |         if (regex) {
> 50 |           await expect(banner).toHaveText(regex);
     |                                ^ Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)
  51 |         } else {
  52 |           await expect(banner).toContainText(error);
  53 |         }
  54 |       });
  55 |     }
  56 |   });
  57 | });
  58 |
```