export const EMPLOYEES_API = {
  getEmployees: "EmployeesApi/GetAllEmployees",
  updateEmployeeStatus: "EmployeesApi/UpdateEmployeStatus",
  updateEmployee: "EmployeesApi/UpdateEmployee",
  updateEmployeesFromAzureAD: "EmployeesApi/UpdateEmployeesFromAzureAD",
  getDepartments: "Department/GetDictionary",
} as const;
