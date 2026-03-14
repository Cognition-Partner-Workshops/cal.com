"use client";

interface RateCardProps {
  term: string;
  rate: number;
  apr: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  termYears: number;
  description: string;
  loanAmount: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RateCard({
  term,
  rate,
  apr,
  monthlyPayment,
  totalInterest,
  totalCost,
  termYears,
  description,
  loanAmount,
}: RateCardProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/30">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{term}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{termYears}-year term</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{rate}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rate</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">APR</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{apr}%</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Monthly Payment</div>
          <div className="text-lg font-semibold text-blue-900 dark:text-blue-200">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Loan Amount</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">{formatCurrency(loanAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Total Interest</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formatCurrency(totalInterest)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Total Cost</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">{description}</p>
    </div>
  );
}
