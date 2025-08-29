import endpoints from "../../../fixtures/endpoints.json" assert { type: "json" };

export class LoginPage {
  constructor() {
    this.token = null;
  }
  async loginAs(apiContext, loginBody) {
    // const loginParams = new URLSearchParams(loginBody);
    const response = await apiContext.post(endpoints.login, {
      data: loginBody, // Automatically sets application/json
      headers: {
        "Content-Type": "application/json",
        tenantId: "fabhrdemo.in",
        username: "FABHR-537-fabhrdemo.in",
      },
    });
    const responseBody = await response.json();
    if (responseBody && responseBody.token) {
      this.token = responseBody.token;
    }
    return {
      status: response.status(),
      body: responseBody,
      token: this.token,
    };
  }

  async logout(apiContext) {
    const response = await apiContext.get(endpoints.logout, {
      headers: {
        tenantId: "fabhrdemo.in",
        username: "FABHR-537-fabhrdemo.in",
      },
    });
    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = {};
    }
    return {
      status: response.status(),
      body: responseBody,
    };
  }
}
