"use client";

interface LoanAmountInputProps {
  loanAmount: number;
  onLoanAmountChange: (amount: number) => void;
}

function getPresetClassName(loanAmount: number, preset: number): string {
  if (loanAmount === preset) {
    return "rounded-full px-3 py-1 text-xs font-medium transition-colors bg-blue-600 text-white";
  }
  return "rounded-full px-3 py-1 text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200";
}

export default function LoanAmountInput({
  loanAmount,
  onLoanAmountChange,
}: LoanAmountInputProps): React.ReactElement {
  const presets = [200000, 350000, 500000, 750000, 1000000];

  function formatDisplayValue(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return (
    <div>
      <label htmlFor="loan-amount" className="mb-2 block text-sm font-medium text-gray-700">
        Loan Amount
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <input
          id="loan-amount"
          type="text"
          value={formatDisplayValue(loanAmount)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const parsed = Number.parseInt(raw, 10);
            if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 10000000) {
              onLoanAmountChange(parsed);
            }
          }}
          className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="350,000"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={(): void => onLoanAmountChange(preset)}
            className={getPresetClassName(loanAmount, preset)}>
            ${formatDisplayValue(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}
