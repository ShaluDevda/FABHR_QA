import endpoints from "../../../../fixtures/endpoints.json" assert { type: "json" };

class Attandance {
  async getAllCheckinDetails(request, token) {
    const response = await request.get(endpoints.getAllCheckinData, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        tenantId: "fabhrdemo.in",
        username: "FABHR-537-fabhrdemo.in",
        token: token,
      },
    });

    try {
      const responseBody = await response.json();
      console.log(responseBody);
      return {
        status: response.status(),
        body: responseBody,
      };
    } catch (error) {
      const responseText = await response.text();
      return {
        status: response.status(),
        body: responseText || {},
        error: error.message,
      };
    }
  }
}

export { Attandance };
