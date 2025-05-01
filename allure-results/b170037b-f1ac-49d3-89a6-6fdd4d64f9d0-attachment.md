# Test info

- Name: Login >> Negative login >> login(T-10, 12345678)
- Location: C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:46:11

# Error details

```
Error: expect(locator).toContainText(expected)

Locator: getByRole('alert')
Expected string: "You have entered incorrect username."
Received: <element(s) not found>
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for getByRole('alert')

    at C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:52:32
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
  50 |           await expect(banner).toHaveText(regex);
  51 |         } else {
> 52 |           await expect(banner).toContainText(error);
     |                                ^ Error: expect(locator).toContainText(expected)
  53 |         }
  54 |       });
  55 |     }
  56 |   });
  57 | });
  58 |
```