"use client";

export function EmployeeCTA() {
  const handleAddClick = () => {
    // Dispatch a custom event that the EmployeeList component listens for
    window.dispatchEvent(new CustomEvent("employee-add-click"));
  };

  return (
    <button
      onClick={handleAddClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      Add Employee
    </button>
  );
}
