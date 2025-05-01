# Test info

- Name: Dashboard UI loads correctly
- Location: C:\Users\shalu\Desktop\FabHr\FabHr\tests\fabHrTests\dashboard.spec.js:7:1

# Error details

```
Error: page.goto: Test timeout of 10000ms exceeded.
Call log:
  - navigating to "http://103.140.73.129:8080/hrms/#/", waiting until "load"

    at LoginPage.navigate (C:\Users\shalu\Desktop\FabHr\FabHr\tests\Pages\loginPage.js:17:23)
    at C:\Users\shalu\Desktop\FabHr\FabHr\tests\fabHrTests\dashboard.spec.js:12:19
```

# Page snapshot

```yaml
- list
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
   1 | // pages/loginPage.js
   2 |
   3 | class LoginPage {
   4 |     /**
   5 |      * @param {import('@playwright/test').Page} page 
   6 |      * @param {string} 
   7 |      */
   8 |     constructor(page, route) {
   9 |       this.page = page;
  10 |       this.route = route;
  11 |       this.usernameInput = page.locator('input[placeholder="Username"]');
  12 |       this.passwordInput = page.locator('input[placeholder="Password"]');
  13 |       this.loginButton = page.getByRole('button', { name: 'Log in' });
  14 |     }
  15 |   
  16 |     async navigate(url, route) {
> 17 |       await this.page.goto(url + route);
     |                       ^ Error: page.goto: Test timeout of 10000ms exceeded.
  18 |     }
  19 |   
  20 |     async login(username, password) {
  21 |       await this.usernameInput.fill(username);
  22 |       await this.passwordInput.fill(password);
  23 |       await this.loginButton.click();
  24 |     }
  25 |   }
  26 |   
  27 |   module.exports = { LoginPage };
  28 |   
```