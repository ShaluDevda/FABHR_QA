# Test info

- Name: Login >> Login with valid username and password
- Location: C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:16:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_TIMED_OUT at http://103.140.73.129:8080/hrms/#/
Call log:
  - navigating to "http://103.140.73.129:8080/hrms/#/", waiting until "load"

    at LoginPage.goto (C:\Users\shalu\Desktop\FabHr\tests\Pages\loginPage.js:17:25)
    at C:\Users\shalu\Desktop\FabHr\tests\fabHrTests\loginTest.spec.js:12:21
```

# Page snapshot

```yaml
- heading "This site can’t be reached" [level=1]
- paragraph:
  - strong: 103.140.73.129
  - text: took too long to respond.
- paragraph: "Try:"
- list:
  - listitem: Checking the connection
  - listitem:
    - link "Checking the proxy and the firewall":
      - /url: "#buttons"
  - listitem:
    - link "Running Windows Network Diagnostics":
      - /url: javascript:diagnoseErrors()
- text: ERR_CONNECTION_TIMED_OUT
- button "Reload"
- button "Details"
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
  16 |     async goto() {
> 17 |         await this.page.goto(this.route);
     |                         ^ Error: page.goto: net::ERR_CONNECTION_TIMED_OUT at http://103.140.73.129:8080/hrms/#/
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