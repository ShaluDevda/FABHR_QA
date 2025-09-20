// Utility to extract all designation names from designation array
export function extractDesignationNames(designationArray) {
	if (!Array.isArray(designationArray)) return [];
	return designationArray.map(item => item.designationName).filter(Boolean);
}
// Utility to extract all Employeelist 
export function extractEmployeeList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.employeeCode && item.employeeId)
        .map(item => ({
            employeeCode: item.employeeCode,
            employeeId: item.employeeId
        }));
		
	}
function getTodayISODate() {
  const today = new Date();
  // Set to 00:00:00 for consistency, or keep as is for current time
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

export function getDynamicARPayload(basePayload) {
  const todayISO = getTodayISODate();
  return {
    ...basePayload,
    fromDate: todayISO,
    toDate: todayISO
  };
}