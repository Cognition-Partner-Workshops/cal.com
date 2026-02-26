"use client";

import { useState } from "react";
import type { StoredEmployee } from "../employee-info/employeeStore";
import { findEmployeeById, deleteEmployeeById, getAllEmployees } from "../employee-info/employeeStore";

type DeleteStatus = "idle" | "found" | "deleted" | "not_found";

function getStatusMessage(status: DeleteStatus): string {
  if (status === "deleted") {
    return "Employee has been successfully deleted.";
  }
  if (status === "not_found") {
    return "No employee found with this ID.";
  }
  return "";
}

function getStatusAlertClass(status: DeleteStatus): string {
  if (status === "deleted") {
    return "rounded-md border border-green-300 bg-green-50 p-4 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-200";
  }
  if (status === "not_found") {
    return "rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-200";
  }
  return "";
}

function EmployeeDetail({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value || "N/A"}</dd>
    </div>
  );
}

function EmployeeCard({ employee }: { employee: StoredEmployee }): React.JSX.Element {
  return (
    <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900">
      <h3 className="mb-3 text-lg font-semibold text-blue-800 dark:text-blue-200">
        Employee Found
      </h3>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <EmployeeDetail label="Employee ID" value={employee.employeeId} />
        <EmployeeDetail label="First Name" value={employee.firstName} />
        <EmployeeDetail label="Last Name" value={employee.lastName} />
        <EmployeeDetail label="Email" value={employee.email} />
        <EmployeeDetail label="Phone" value={employee.phone} />
        <EmployeeDetail label="Department" value={employee.department} />
        <EmployeeDetail label="Designation" value={employee.designation} />
        <EmployeeDetail label="Joining Date" value={employee.joiningDate} />
      </dl>
    </div>
  );
}

interface EmployeeListRowProps {
  employee: StoredEmployee;
  onSelect: (id: string) => void;
}

function EmployeeListRow({ employee, onSelect }: EmployeeListRowProps): React.JSX.Element {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-4 py-3 text-sm">{employee.employeeId}</td>
      <td className="px-4 py-3 text-sm">{employee.firstName} {employee.lastName}</td>
      <td className="px-4 py-3 text-sm">{employee.department}</td>
      <td className="px-4 py-3 text-sm">{employee.designation}</td>
      <td className="px-4 py-3 text-sm">
        <button
          type="button"
          onClick={(): void => onSelect(employee.employeeId)}
          className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
          Select
        </button>
      </td>
    </tr>
  );
}

function EmployeeListTable({ onSelect }: { onSelect: (id: string) => void }): React.JSX.Element {
  const employees = getAllEmployees();

  if (employees.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No employees found. Add employees from the{" "}
          <a href="/employee-info" className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400">
            Employee Info
          </a>{" "}
          page first.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Designation
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {employees.map((emp) => (
            <EmployeeListRow key={emp.employeeId} employee={emp} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchSection({
  searchId,
  onSearchChange,
  onSearch,
  inputClass,
}: {
  searchId: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  inputClass: string;
}): React.JSX.Element {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={searchId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onSearchChange(e.target.value)}
        className={inputClass}
        placeholder="Enter Employee ID (e.g., EMP-001)"
      />
      <button
        type="button"
        onClick={onSearch}
        className="whitespace-nowrap rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Search
      </button>
    </div>
  );
}

function ConfirmDeleteSection({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
        Confirm Delete
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        Cancel
      </button>
    </div>
  );
}

function useDeleteEmployee(): {
  searchId: string;
  setSearchId: (value: string) => void;
  foundEmployee: StoredEmployee | undefined;
  status: DeleteStatus;
  handleSearch: () => void;
  handleDelete: () => void;
  handleCancel: () => void;
  handleSelectFromList: (employeeId: string) => void;
} {
  const [searchId, setSearchId] = useState("");
  const [foundEmployee, setFoundEmployee] = useState<StoredEmployee | undefined>(undefined);
  const [status, setStatus] = useState<DeleteStatus>("idle");

  const handleSearch = (): void => {
    if (!searchId.trim()) {
      return;
    }
    const employee = findEmployeeById(searchId.trim());
    if (employee) {
      setFoundEmployee(employee);
      setStatus("found");
    } else {
      setFoundEmployee(undefined);
      setStatus("not_found");
    }
  };

  const handleDelete = (): void => {
    if (!foundEmployee) {
      return;
    }
    deleteEmployeeById(foundEmployee.employeeId);
    setFoundEmployee(undefined);
    setSearchId("");
    setStatus("deleted");
  };

  const handleCancel = (): void => {
    setFoundEmployee(undefined);
    setStatus("idle");
  };

  const handleSelectFromList = (employeeId: string): void => {
    setSearchId(employeeId);
    const employee = findEmployeeById(employeeId);
    if (employee) {
      setFoundEmployee(employee);
      setStatus("found");
    }
  };

  return { searchId, setSearchId, foundEmployee, status, handleSearch, handleDelete, handleCancel, handleSelectFromList };
}

function PageHeader(): React.JSX.Element {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Delete Employee</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Search for an employee by ID and delete their record
      </p>
      <a
        href="/employee-info"
        className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
        &larr; Back to Employee Info
      </a>
    </div>
  );
}

export default function DeleteEmployeeForm(): React.JSX.Element {
  const state = useDeleteEmployee();

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
  const sectionClass =
    "mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800";

  const statusMessage = getStatusMessage(state.status);
  const statusAlertClass = getStatusAlertClass(state.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader />

        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Search by Employee ID</h2>
          <SearchSection searchId={state.searchId} onSearchChange={state.setSearchId} onSearch={state.handleSearch} inputClass={inputClass} />
        </div>

        {statusMessage && (
          <div className={statusAlertClass}>
            <p className="font-medium">{statusMessage}</p>
          </div>
        )}

        {state.status === "found" && state.foundEmployee && (
          <div className={sectionClass}>
            <EmployeeCard employee={state.foundEmployee} />
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-red-600 dark:text-red-400">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <ConfirmDeleteSection onConfirm={state.handleDelete} onCancel={state.handleCancel} />
            </div>
          </div>
        )}

        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">All Employees</h2>
          <EmployeeListTable onSelect={state.handleSelectFromList} />
        </div>
      </div>
    </div>
  );
}
