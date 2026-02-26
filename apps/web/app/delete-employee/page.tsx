import type { Metadata } from "next";

import DeleteEmployeeForm from "./DeleteEmployeeForm";

export const metadata: Metadata = {
  title: "Delete Employee",
  description: "Delete an employee record by Employee ID",
};

export default function DeleteEmployeePage(): React.JSX.Element {
  return <DeleteEmployeeForm />;
}
