import endpoints from "../../../fixtures/endpoints.json" assert { type: "json" };

export class LoginPage {
  async loginAs(apiContext, loginBody) {
    // const loginParams = new URLSearchParams(loginBody);
    const response = await apiContext.post(endpoints.login, {
      data: loginBody, // Automatically sets application/json
      headers: {
        "Content-Type": "application/json",
        tenantId: "fabhrdemo.in",
        username: "FABHR-72-fabhrdemo.in",
      },
    });
    const responseBody = await response.json();

    if (response.status() !== 200) {
      throw new Error(`Login failed with status ${response.status()}`);
    }
    return {
      status: response.status(),
      body: responseBody,
    };
  }
}
