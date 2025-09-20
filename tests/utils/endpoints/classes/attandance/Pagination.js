import endpoints from "../../../../fixtures/endpoints.json" assert { type: "json" };
import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };

class Pagination {
  async verifyPagination(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.applyAR + endpoints.pending,
      {
        data: paginationBody,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

export { Pagination };
