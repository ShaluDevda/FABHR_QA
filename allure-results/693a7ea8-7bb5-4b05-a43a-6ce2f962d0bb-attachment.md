# Test info

- Name: Login >> Login with valid username and password
- Location: C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:16:7

# Error details

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('//span[normalize-space()=\'Dashboard\']') to be visible

    at C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:22:21
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
- textbox "Password": "12345678"
- text: visibility_off
- paragraph: Error! User Blocked
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
> 22 |     await dashboard.waitFor({ state: "visible", timeout: 10_000 });
     |                     ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  23 |
  24 |     // 2. Assert it’s visible
  25 |     await expect(dashboard).toBeVisible();
  26 |
  27 |     // 3. Assert it has exactly the text "Dashboard"
  28 |     await expect(dashboard).toHaveText("Dashboard");
  29 |   });
  30 |
  31 |   // ─────────────────────────────────────────────────────────────────────────────
  32 |   const negativeCases = [
  33 |     {
  34 |       user: 'T-10',
  35 |       pass: '123',
  36 |       // your “incorrect username” banner lives in this <p>
  37 |       selector: "//p[@class='loginError login-errorT']",
  38 |       expected: 'You have entered incorrect username.'
  39 |     },
  40 |     {
  41 |       user: 'T-10',
  42 |       pass: '12345678',
  43 |       selector: "//p[@class='loginError login-errorT']",
  44 |       expected: 'You have entered incorrect username.'
  45 |     },
  46 |     {
  47 |       user: 'T-103-test.in',
  48 |       pass: '0',
  49 |       selector: "//p[@class='loginError login-errorT']",
  50 |       // dynamic password-attempt message
  51 |       expectedRegex: /^(?:Incorrect password .* \d+ unsuccessful attempt's out of 5 allowed attempts\.|Error! User Blocked)$/
  52 |         },
  53 |   ];
  54 |
  55 |   test.describe('Negative login', () => {
  56 |     for (const { user, pass, selector, expected, expectedRegex } of negativeCases) {
  57 |       test(`login(${user}, ${pass}) shows error`, async ({ page }) => {
  58 |         await loginPage.login(user, pass);
  59 |
  60 |         const banner = page.locator(selector);
  61 |         // wait for that particular banner to appear
  62 |         await banner.waitFor({ state: 'visible', timeout: 5_000 });
  63 |
  64 |         if (expectedRegex) {
  65 |           await expect(banner).toHaveText(expectedRegex);
  66 |         } else {
  67 |           await expect(banner).toContainText(expected);
  68 |         }
  69 |       });
  70 |     }
  71 |   });
  72 | });
```