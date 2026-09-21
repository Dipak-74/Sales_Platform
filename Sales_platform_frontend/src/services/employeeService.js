import api from "./api";

// Create the login user before creating the employee profile.
export const createEmployeeUser = (data) =>
  api.post("/api/manager/users", data);

// Get employees by manager
export const getEmployeesByManager = (managerId) =>
  api.get(`/api/manager/employees/manager/${managerId}`);

// Alias for general employee fetching for a manager
export const getEmployees = (managerId) =>
  managerId ? getEmployeesByManager(managerId) : Promise.reject(new Error("A manager ID is required to load employees."));

// Get employee by ID
export const getEmployeeById = (id) =>
  api.get(`/api/manager/employees/${id}`);

// Get employee by user ID
export const getEmployeeByUserId = (userId) =>
  api.get(`/api/manager/employees/user/${userId}`);

// Get employees by department
export const getEmployeesByDepartment = (departmentId) =>
  api.get(`/api/manager/employees/department/${departmentId}`);

// Create employee with exact EmployeeRequestDTO (userId, managerId, departmentId, designation, joiningDate)
export const createEmployee = (data) =>
  api.post("/api/manager/employees", data);

// Update employee
export const updateEmployee = (id, data) =>
  api.put(`/api/manager/employees/${id}`, data);

// Activate / Deactivate employee
export const updateEmployeeStatus = (id, status) =>
  api.put(`/api/manager/employees/${id}/status`, null, {
    params: { status },
  });
