"use client";

import { useEffect, useState } from "react";

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  joinDate: string;
  status: "active" | "inactive";
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Software Engineer",
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Marketing",
    role: "Marketing Manager",
    joinDate: "2023-06-20",
    status: "active",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    department: "HR",
    role: "HR Specialist",
    joinDate: "2024-03-10",
    status: "active",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    department: "Engineering",
    role: "Senior Developer",
    joinDate: "2022-11-01",
    status: "inactive",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    department: "Design",
    role: "UI/UX Designer",
    joinDate: "2024-05-22",
    status: "active",
  },
];

const DEPARTMENTS = ["Engineering", "Marketing", "HR", "Design", "Sales", "Finance"];

function EmployeeForm({
  employee,
  onSave,
  onCancel,
}: {
  employee: Employee | null;
  onSave: (data: Omit<Employee, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(employee?.name ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [department, setDepartment] = useState(employee?.department ?? DEPARTMENTS[0]);
  const [role, setRole] = useState(employee?.role ?? "");
  const [joinDate, setJoinDate] = useState(employee?.joinDate ?? new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"active" | "inactive">(employee?.status ?? "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, department, role, joinDate, status });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-default border-subtle mb-6 space-y-4 rounded-lg border p-6">
      <h3 className="text-emphasis text-lg font-semibold">
        {employee ? "Edit Employee" : "Add New Employee"}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Role</label>
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Job role"
          />
        </div>
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Join Date</label>
          <input
            type="date"
            required
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-default mb-1 block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
            className="border-subtle bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {employee ? "Update" : "Add"} Employee
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-subtle text-default rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");

  useEffect(() => {
    const handler = () => startAdd();
    window.addEventListener("employee-add-click", handler);
    return () => window.removeEventListener("employee-add-click", handler);
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "All" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAdd = (data: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...data,
      id: Math.max(...employees.map((e) => e.id), 0) + 1,
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setShowForm(false);
  };

  const handleEdit = (data: Omit<Employee, "id">) => {
    if (!editingEmployee) return;
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingEmployee.id ? { ...data, id: editingEmployee.id } : emp))
    );
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const startAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const activeCount = employees.filter((e) => e.status === "active").length;
  const inactiveCount = employees.filter((e) => e.status === "inactive").length;

  return (
    <div>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-default border-subtle rounded-lg border p-4">
          <p className="text-default text-sm">Total Employees</p>
          <p className="text-emphasis text-2xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-default border-subtle rounded-lg border p-4">
          <p className="text-default text-sm">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-default border-subtle rounded-lg border p-4">
          <p className="text-default text-sm">Inactive</p>
          <p className="text-2xl font-bold text-red-500">{inactiveCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-subtle bg-default text-emphasis flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border-subtle bg-default text-emphasis rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={editingEmployee ? handleEdit : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Employee Table */}
      <div className="border-subtle overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-subtle border-subtle border-b">
            <tr>
              <th className="text-default px-4 py-3 font-medium">Name</th>
              <th className="text-default px-4 py-3 font-medium">Email</th>
              <th className="text-default hidden px-4 py-3 font-medium md:table-cell">Department</th>
              <th className="text-default hidden px-4 py-3 font-medium lg:table-cell">Role</th>
              <th className="text-default hidden px-4 py-3 font-medium lg:table-cell">Join Date</th>
              <th className="text-default px-4 py-3 font-medium">Status</th>
              <th className="text-default px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-default px-4 py-8 text-center">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-subtle hover:bg-subtle border-b last:border-b-0">
                  <td className="text-emphasis px-4 py-3 font-medium">{emp.name}</td>
                  <td className="text-default px-4 py-3">{emp.email}</td>
                  <td className="text-default hidden px-4 py-3 md:table-cell">{emp.department}</td>
                  <td className="text-default hidden px-4 py-3 lg:table-cell">{emp.role}</td>
                  <td className="text-default hidden px-4 py-3 lg:table-cell">{emp.joinDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        emp.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}>
                      {emp.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(emp)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EmployeeAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      Add Employee
    </button>
  );
}
