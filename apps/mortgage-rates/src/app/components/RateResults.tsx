"use client";

import type { MortgageRate } from "@/types/mortgage";

import RateCard from "./RateCard";

interface RateWithPayment extends MortgageRate {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  termYears: number;
}

interface RateApiResponse {
  location: string;
  state: string;
  rates: RateWithPayment[];
  lastUpdated: string;
  loanAmount: number;
}

interface RateResultsProps {
  rateData: RateApiResponse;
}

export default function RateResults({ rateData }: RateResultsProps): React.ReactElement {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rates for {rateData.location}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Last updated:{" "}
            {new Date(rateData.lastUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="hidden rounded-lg bg-blue-50 px-4 py-2 sm:block dark:bg-blue-950">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Loan: ${new Intl.NumberFormat("en-US").format(rateData.loanAmount)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rateData.rates.map((rate) => (
          <RateCard
            key={rate.term}
            term={rate.term}
            rate={rate.rate}
            apr={rate.apr}
            monthlyPayment={rate.monthlyPayment}
            totalInterest={rate.totalInterest}
            totalCost={rate.totalCost}
            termYears={rate.termYears}
            description={rate.description}
            loanAmount={rateData.loanAmount}
          />
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-gray-100 p-4 text-xs leading-relaxed text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <strong>Disclaimer:</strong> The rates shown are for informational purposes only and are based on
        regional averages. Actual rates may vary based on credit score, down payment, loan type, and lender.
        Rates are subject to change without notice. Contact a licensed mortgage lender for personalized rate
        quotes. Monthly payment estimates do not include taxes, insurance, or HOA fees.
      </div>
    </div>
  );
}
