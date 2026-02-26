import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import { _generateMetadata } from "app/_utils";

import EmployeeList from "./employee-list";
import { EmployeeCTA } from "./employee-cta";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Employees",
    () => "Manage your organization employees",
    undefined,
    undefined,
    "/employees"
  );

const Page = () => {
  return (
    <ShellMainAppDir heading="Employees" subtitle="Manage your organization employees" CTA={<EmployeeCTA />}>
      <EmployeeList />
    </ShellMainAppDir>
  );
};

export default Page;
