/**
 * Client-side employee store using localStorage.
 * Shared between the employee-info and delete-employee pages.
 */

interface StoredEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
  designation: string;
  employeeId: string;
  joiningDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const STORAGE_KEY = "cal_employee_store";

function readStore(): StoredEmployee[] {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as StoredEmployee[];
  } catch {
    return [];
  }
}

function writeStore(employees: StoredEmployee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function getAllEmployees(): StoredEmployee[] {
  return readStore();
}

export function addEmployee(employee: StoredEmployee): void {
  const employees = readStore();
  const existingIndex = employees.findIndex(
    (e) => e.employeeId === employee.employeeId
  );
  if (existingIndex >= 0) {
    employees[existingIndex] = employee;
  } else {
    employees.push(employee);
  }
  writeStore(employees);
}

export function findEmployeeById(employeeId: string): StoredEmployee | undefined {
  const employees = readStore();
  return employees.find((e) => e.employeeId === employeeId);
}

export function deleteEmployeeById(employeeId: string): boolean {
  const employees = readStore();
  const filtered = employees.filter((e) => e.employeeId !== employeeId);
  if (filtered.length === employees.length) {
    return false;
  }
  writeStore(filtered);
  return true;
}

export type { StoredEmployee };
