import endpoints from "../../../../fixtures/endpoints.json" assert { type: "json" };

class CompanyAnnouncement {
  async createAnnouncement(request, payload, token) {
    const response = await request.post(endpoints.massCommunication, {
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        tenantId: "fabhrdemo.in",
        username: "FABHR-537-fabhrdemo.in",
        token: token 
      },
    });
    
    try {
      const responseBody = await response.json();
      return {
        status: response.status(),
        body: responseBody
      };
    } catch (error) {
      const responseText = await response.text();
      return {
        status: response.status(),
        body: responseText || {},
        error: error.message
      };
    }
  }
}

export { CompanyAnnouncement };
