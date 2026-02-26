import type { Metadata } from "next";

import EmployeeInfoForm from "./EmployeeInfoForm";

export const metadata: Metadata = {
  title: "Employee Personal Information",
  description: "Capture employee personal information and generate test results in Word document",
};

export default function EmployeeInfoPage(): React.JSX.Element {
  return <EmployeeInfoForm />;
}
