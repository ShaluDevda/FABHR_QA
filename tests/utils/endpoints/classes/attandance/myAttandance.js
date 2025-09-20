import endpoints from "../../../../fixtures/endpoints.json" assert { type: "json" };
 import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };

class Attandance {
  /**
   * Generate current date and time for attendance operations
   * @returns {Object} Object containing current date and time
   */
  static getCurrentDateTime() {
    const now = new Date();
    
    // Format time as HH:MM:SS
    const time = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    
    // Format date as YYYY-MM-DD
    const date = now.toISOString().split('T')[0];
    
    // Get timestamp
    const timestamp = now.getTime();
    
    return {
      time: time,
      date: date,
      timestamp: timestamp,
      formattedDateTime: `${date} ${time}`
    };
  }

  /**
   * Create attendance payload with current date and time
   * @param {string} inOut - "in" or "out"
   * @param {Object} additionalData - Additional data to override defaults
   * @returns {Object} Attendance payload with current date/time
   */
  static createAttendancePayload(inOut = "in", additionalData = {}) {
    const currentDateTime = this.getCurrentDateTime();
    
    const basePayload = {
      punchTimeDetailsId: null,
      date: currentDateTime.date,
      flag: null,
      time: currentDateTime.time,
      hhMm: null,
      companyId: 1,
      in_out: inOut,
      sNo: null,
      tktNo: inputsData.username,
      intime: null,
      outtime: null,
      address: null,
      employeeId: 368,
      fileLocation: null,
      firstName: null,
      lastName: null,
      middleName: null,
      employeeCode: null
    };
    
    // Merge with any additional data
    return { ...basePayload, ...additionalData };
  }
  async getAllCheckinDetails(request, token) {
    const response = await request.get(endpoints.getAllCheckinData, {
      method: "GET",
      headers: {
        "Content-Type":inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
    });

    try {
      const responseBody = await response.json();
     
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

  async getAllCheckinDetailsWithoutUsername(request, token) {
    const response = await request.get(endpoints.getAllCheckinData, {
      method: "GET",
      headers: {
        "Content-Type":inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        // username header intentionally omitted for negative testing
      },
    });

    try {
      const responseBody = await response.json();
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

  async postWebAttendance(request, token, attendanceData) {
    const response = await request.post(endpoints.webAttendance, {
      method: "POST",
      headers: {
        "Content-Type":inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
      data: attendanceData,
    });

    try {
      const responseBody = await response.json();
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

  /**
   * Apply Work From Home request
   * @param {Object} request - Playwright request object
   * @param {Object} wfhData - WFH request data
   * @param {string} token - Authentication token
   * @returns {Object} Response object with status and body
   */
  async applyWFH(request, wfhData, token) {
    const response = await request.post(endpoints.applyWFH, {
      method: "POST",
      headers: {
        "Content-Type":inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        "Authorization": `Bearer ${token}`,
      },
      data: wfhData,
    });

    try {
      const responseBody = await response.json();
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

  /**
   * Apply Work From Home request without authentication token
   * @param {Object} request - Playwright request object
   * @param {Object} wfhData - WFH request data
   * @returns {Object} Response object with status and body
   */
  async applyWFHWithoutToken(request, wfhData) {
    const response = await request.post(endpoints.applyWFH, {
      method: "POST",
      headers: {
        "Content-Type":inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
      data: wfhData,
    });

    try {
      const responseBody = await response.json();
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

  /**
   * Reject/Cancel Work From Home request
   * @param {Object} request - Playwright request object
   * @param {Object} rejectWFHData - WFH rejection data
   * @param {string} token - Authentication token
   * @returns {Object} Response object with status and body
   */
  async rejectWFH(request, rejectWFHData, token) {
    const response = await request.post(endpoints.applyWFH, {
      method: "POST",
      headers: {
        "Content-Type":inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
      data: rejectWFHData,
    });

    try {
      const responseBody = await response.json();
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

  async applyAR(apiContext, arBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.applyAR, {
      data: arBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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

  async getPaginatedARPendingRequestDetails(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.getPaginatedARPendingRequestDetails, {
      data: paginationBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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

  async getPaginatedARNonPendingRequestDetails(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.getPaginatedARNonPendingRequestDetails, {
      data: paginationBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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


  async applyWFH(apiContext, wfhBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.applyWFH, {
      data: wfhBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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
  async getPaginatedWFHPendingRequestDetails(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.getPaginatedWFHPendingRequestDetails, {
      data: paginationBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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

  async getPaginatedWFHNonPendingRequestDetails(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.getPaginatedWFHNonPendingRequestDetails, {
      data: paginationBody,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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
 
  async findAllPreviousMonthWithCurrent(request, authToken){
    const response = await request.get(endpoints.findAllPreviousMonthWithCurrent, {
      method: "GET",
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
      },
    });

    try {
      const responseBody = await response.json();
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
  async getDesignation(request, authToken){
    const response = await request.get(endpoints.getDesignation, {
      method: "GET",
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
      },
    });

    try {
      const responseBody = await response.json();
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

   async hybridWfh(apiContext, paylod, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hybridWFH, {
      data: paylod,
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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
  async getEmployeeList(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.getEmployeeList, {
      headers: {
        "Content-Type":inputsData.ContentType,
        "tenantId": inputsData.tenantId,
        "username": inputsData.username,
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
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

export { Attandance };
