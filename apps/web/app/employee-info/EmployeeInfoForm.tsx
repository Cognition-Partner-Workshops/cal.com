"use client";

import { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import { addEmployee } from "./employeeStore";

interface EmployeeData {
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

interface TestResult {
  field: string;
  value: string;
  status: "Pass" | "Fail";
  remark: string;
}

const initialFormData: EmployeeData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  department: "",
  designation: "",
  employeeId: "",
  joiningDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

function buildMinLengthResult(field: string, value: string, minLen: number): TestResult {
  if (value.trim().length >= minLen) {
    return { field, value, status: "Pass", remark: `Valid ${field.toLowerCase()}` };
  }
  return { field, value, status: "Fail", remark: `${field} must be at least ${minLen} characters` };
}

function buildRegexResult(
  field: string,
  value: string,
  regex: RegExp,
  passMsg: string,
  failMsg: string
): TestResult {
  if (regex.test(value)) {
    return { field, value, status: "Pass", remark: passMsg };
  }
  return { field, value, status: "Fail", remark: failMsg };
}

function buildRequiredResult(field: string, value: string, passMsg: string, failMsg: string): TestResult {
  if (value) {
    return { field, value, status: "Pass", remark: passMsg };
  }
  return { field, value, status: "Fail", remark: failMsg };
}

function validateEmployeeData(data: EmployeeData): TestResult[] {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s()-]{7,15}$/;
  const zipRegex = /^\d{5,6}$/;

  return [
    buildMinLengthResult("First Name", data.firstName, 2),
    buildMinLengthResult("Last Name", data.lastName, 2),
    buildRegexResult("Email", data.email, emailRegex, "Valid email format", "Invalid email format"),
    buildRegexResult("Phone", data.phone, phoneRegex, "Valid phone number", "Invalid phone number format"),
    buildRequiredResult("Date of Birth", data.dateOfBirth, "Date of birth provided", "Date of birth is required"),
    buildRequiredResult("Gender", data.gender, "Gender selected", "Gender selection is required"),
    buildMinLengthResult("Address", data.address, 5),
    buildMinLengthResult("City", data.city, 2),
    buildMinLengthResult("State", data.state, 2),
    buildRegexResult("Zip Code", data.zipCode, zipRegex, "Valid zip code", "Zip code must be 5-6 digits"),
    buildRequiredResult("Department", data.department, "Department selected", "Department selection is required"),
    buildMinLengthResult("Designation", data.designation, 2),
    buildMinLengthResult("Employee ID", data.employeeId, 3),
    buildRequiredResult("Joining Date", data.joiningDate, "Joining date provided", "Joining date is required"),
    buildMinLengthResult("Emergency Contact Name", data.emergencyContactName, 2),
    buildRegexResult(
      "Emergency Contact Phone",
      data.emergencyContactPhone,
      phoneRegex,
      "Valid emergency contact phone",
      "Invalid emergency contact phone format"
    ),
  ];
}

function getStatusColor(status: "Pass" | "Fail"): string {
  if (status === "Pass") {
    return "008000";
  }
  return "FF0000";
}

function getValueOrFallback(value: string, fallback: string): string {
  if (value) {
    return value;
  }
  return fallback;
}

function getStatusBadgeClass(status: "Pass" | "Fail"): string {
  if (status === "Pass") {
    return "inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  }
  return "inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

function getExportButtonText(isGenerating: boolean): string {
  if (isGenerating) {
    return "Generating...";
  }
  return "Export to Word Document";
}

const TABLE_BORDER = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
} as const;

function getEmployeeDataRows(data: EmployeeData): string[][] {
  return [
    ["First Name", data.firstName],
    ["Last Name", data.lastName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Date of Birth", data.dateOfBirth],
    ["Gender", data.gender],
    ["Address", data.address],
    ["City", data.city],
    ["State", data.state],
    ["Zip Code", data.zipCode],
    ["Department", data.department],
    ["Designation", data.designation],
    ["Employee ID", data.employeeId],
    ["Joining Date", data.joiningDate],
    ["Emergency Contact Name", data.emergencyContactName],
    ["Emergency Contact Phone", data.emergencyContactPhone],
  ];
}

function buildKeyValueRow(field: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: field, size: 20 })] })],
        borders: TABLE_BORDER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: getValueOrFallback(value, "N/A"), size: 20 })] })],
        borders: TABLE_BORDER,
      }),
    ],
  });
}

function buildHeaderRow(headers: string[], bold: boolean, headerSize: number): TableRow {
  return new TableRow({
    children: headers.map(
      (text) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold, size: headerSize })] })],
          borders: TABLE_BORDER,
        })
    ),
  });
}

function buildEmployeeTable(data: EmployeeData): Table {
  const rows = getEmployeeDataRows(data);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      buildHeaderRow(["Field", "Value"], true, 22),
      ...rows.map(([field, value]) => buildKeyValueRow(field, value)),
    ],
  });
}

function buildTestResultRow(result: TestResult, index: number): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: String(index + 1), size: 20 })] })],
        borders: TABLE_BORDER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: result.field, size: 20 })] })],
        borders: TABLE_BORDER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: getValueOrFallback(result.value, "(empty)"), size: 20 })] })],
        borders: TABLE_BORDER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: result.status, bold: true, color: getStatusColor(result.status), size: 20 })] })],
        borders: TABLE_BORDER,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: result.remark, size: 20 })] })],
        borders: TABLE_BORDER,
      }),
    ],
  });
}

function buildTestResultsTable(testResults: TestResult[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      buildHeaderRow(["#", "Field", "Value", "Status", "Remark"], true, 22),
      ...testResults.map((result, index) => buildTestResultRow(result, index)),
    ],
  });
}

function buildCommonMistakesParagraphs(): Paragraph[] {
  const mistakes = [
    "1. Email format errors - Missing '@' symbol or domain",
    "2. Phone number format - Including letters or special characters",
    "3. Zip code format - Providing alphanumeric instead of numeric",
    "4. Missing required fields - Leaving mandatory fields blank",
    "5. Short names - Providing single character names",
  ];
  return mistakes.map(
    (text) =>
      new Paragraph({
        children: [new TextRun({ text, size: 20 })],
      })
  );
}

function buildSummaryParagraphs(passCount: number, failCount: number, totalCount: number): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: "3. Test Summary", bold: true, size: 26 })],
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({ children: [] }),
    new Paragraph({ children: [new TextRun({ text: `Total Tests: ${totalCount}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Passed: ${passCount}`, size: 22, color: "008000" })] }),
    new Paragraph({ children: [new TextRun({ text: `Failed: ${failCount}`, size: 22, color: "FF0000" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Pass Rate: ${((passCount / totalCount) * 100).toFixed(1)}%`, size: 22, bold: true })],
    }),
  ];
}

function buildDocumentSections(testResults: TestResult[]): Paragraph[] {
  const passCount = testResults.filter((r) => r.status === "Pass").length;
  const failCount = testResults.filter((r) => r.status === "Fail").length;
  const now = new Date().toLocaleString();

  return [
    new Paragraph({
      children: [new TextRun({ text: "Employee Personal Information - Test Report", bold: true, size: 32 })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Report Generated: ${now}`, size: 20, italics: true })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: "1. Employee Personal Information", bold: true, size: 26 })],
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({ children: [] }),
    ...buildSummaryParagraphs(passCount, failCount, testResults.length),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: "Common Mistakes Based on History of Issues:", bold: true, size: 24 })],
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({ children: [] }),
    ...buildCommonMistakesParagraphs(),
  ];
}

async function generateWordDocument(data: EmployeeData, testResults: TestResult[]): Promise<void> {
  const employeeTable = buildEmployeeTable(data);
  const testResultsTable = buildTestResultsTable(testResults);
  const sections = buildDocumentSections(testResults);

  const doc = new Document({
    sections: [
      {
        children: [
          ...sections.slice(0, 5),
          employeeTable,
          new Paragraph({ children: [] }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [new TextRun({ text: "2. Data Validation Test Results", bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),
          testResultsTable,
          new Paragraph({ children: [] }),
          ...sections.slice(5),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Employee_Test_Report_${getValueOrFallback(data.employeeId, "unknown")}_${Date.now()}.docx`);
}

interface FormSectionProps {
  formData: EmployeeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputClass: string;
  labelClass: string;
  sectionClass: string;
}

interface TestResultsDisplayProps {
  testResults: TestResult[];
  passCount: number;
  failCount: number;
  generating: boolean;
  sectionClass: string;
  handleExportWord: () => void;
}

function PersonalInfoSection({ formData, handleChange, inputClass, labelClass, sectionClass }: FormSectionProps): React.JSX.Element {
  return (
    <div className={sectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="employee@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputClass}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function AddressSection({ formData, handleChange, inputClass, labelClass, sectionClass }: FormSectionProps): React.JSX.Element {
  return (
    <div className={sectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Address
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="address" className={labelClass}>
            Street Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClass}
            rows={2}
            placeholder="Enter street address"
          />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter city"
          />
        </div>
        <div>
          <label htmlFor="state" className={labelClass}>
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter state"
          />
        </div>
        <div>
          <label htmlFor="zipCode" className={labelClass}>
            Zip Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={inputClass}
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );
}

function EmploymentSection({ formData, handleChange, inputClass, labelClass, sectionClass }: FormSectionProps): React.JSX.Element {
  return (
    <div className={sectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Employment Details
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="employeeId" className={labelClass}>
            Employee ID *
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className={inputClass}
            placeholder="EMP-001"
          />
        </div>
        <div>
          <label htmlFor="department" className={labelClass}>
            Department *
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={inputClass}>
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="IT">IT</option>
            <option value="Legal">Legal</option>
          </select>
        </div>
        <div>
          <label htmlFor="designation" className={labelClass}>
            Designation *
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={inputClass}
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <label htmlFor="joiningDate" className={labelClass}>
            Joining Date *
          </label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

function EmergencyContactSection({ formData, handleChange, inputClass, labelClass, sectionClass }: FormSectionProps): React.JSX.Element {
  return (
    <div className={sectionClass}>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Emergency Contact
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="emergencyContactName" className={labelClass}>
            Contact Name *
          </label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Emergency contact name"
          />
        </div>
        <div>
          <label htmlFor="emergencyContactPhone" className={labelClass}>
            Contact Phone *
          </label>
          <input
            type="tel"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+1 (555) 987-6543"
          />
        </div>
      </div>
    </div>
  );
}

function EmployeePageHeader(): React.JSX.Element {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Personal Information</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Capture employee details and validate data with exportable test results
      </p>
      <a
        href="/delete-employee"
        className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
        Go to Delete Employee &rarr;
      </a>
    </div>
  );
}

function FormActions({ handleReset }: { handleReset: () => void }): React.JSX.Element {
  return (
    <div className="flex gap-4">
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Submit &amp; Validate
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        Reset
      </button>
    </div>
  );
}

function TestResultsDisplay({ testResults, passCount, failCount, generating, sectionClass, handleExportWord }: TestResultsDisplayProps): React.JSX.Element {
  return (
    <div className="mt-8">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/30">
          <p className="text-sm text-blue-600 dark:text-blue-400">Total Tests</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {testResults.length}
          </p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/30">
          <p className="text-sm text-green-600 dark:text-green-400">Passed</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            {passCount}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200">
            {failCount}
          </p>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Validation Test Results
          </h2>
          <button
            type="button"
            onClick={handleExportWord}
            disabled={generating}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
            {getExportButtonText(generating)}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Field
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {testResults.map((result, index) => (
                <tr key={result.field}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {result.field}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {getValueOrFallback(result.value, "(empty)")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className={getStatusBadgeClass(result.status)}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {result.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Common Mistakes Based on History of Issues
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <span className="font-medium">Email format errors</span> - Missing
            &apos;@&apos; symbol or domain
          </li>
          <li>
            <span className="font-medium">Phone number format</span> - Including
            letters or special characters
          </li>
          <li>
            <span className="font-medium">Zip code format</span> - Providing
            alphanumeric instead of numeric values
          </li>
          <li>
            <span className="font-medium">Missing required fields</span> - Leaving
            mandatory fields blank
          </li>
          <li>
            <span className="font-medium">Short names</span> - Providing single
            character names for first/last name
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function EmployeeInfoForm(): React.JSX.Element {
  const [formData, setFormData] = useState<EmployeeData>(initialFormData);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const results = validateEmployeeData(formData);
    setTestResults(results);
    setSubmitted(true);
    addEmployee(formData);
  };

  const handleExportWord = async (): Promise<void> => {
    setGenerating(true);
    try {
      await generateWordDocument(formData, testResults);
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = (): void => {
    setFormData(initialFormData);
    setTestResults([]);
    setSubmitted(false);
  };

  const passCount = testResults.filter((r) => r.status === "Pass").length;
  const failCount = testResults.filter((r) => r.status === "Fail").length;

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";
  const sectionClass = "mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800";
  const sectionProps = { formData, handleChange, inputClass, labelClass, sectionClass };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <EmployeePageHeader />

        <form onSubmit={handleSubmit}>
          <PersonalInfoSection {...sectionProps} />
          <AddressSection {...sectionProps} />
          <EmploymentSection {...sectionProps} />
          <EmergencyContactSection {...sectionProps} />
          <FormActions handleReset={handleReset} />
        </form>

        {submitted && testResults.length > 0 && (
          <TestResultsDisplay
            testResults={testResults}
            passCount={passCount}
            failCount={failCount}
            generating={generating}
            sectionClass={sectionClass}
            handleExportWord={handleExportWord}
          />
        )}
      </div>
    </div>
  );
}
