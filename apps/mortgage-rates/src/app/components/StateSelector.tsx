"use client";

import { US_STATES } from "@/types/mortgage";

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

function handleChange(e: React.ChangeEvent<HTMLSelectElement>, onStateChange: (state: string) => void): void {
  onStateChange(e.target.value);
}

export default function StateSelector({
  selectedState,
  onStateChange,
}: StateSelectorProps): React.ReactElement {
  const sortedStates = Object.entries(US_STATES).sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div className="relative">
      <label
        htmlFor="state-select"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Your State
      </label>
      <select
        id="state-select"
        value={selectedState}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => handleChange(e, onStateChange)}
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
        <option value="">-- Choose a state --</option>
        {sortedStates.map(([code, name]) => (
          <option key={code} value={code}>
            {name} ({code})
          </option>
        ))}
      </select>
    </div>
  );
}
