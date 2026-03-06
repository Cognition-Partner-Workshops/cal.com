"use client";

import { useCallback, useEffect, useState } from "react";

import type { MortgageRate } from "@/types/mortgage";

import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";
import LoanAmountInput from "./LoanAmountInput";
import RateResults from "./RateResults";
import StateSelector from "./StateSelector";

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

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}

export default function MortgageRateDashboard(): React.ReactElement {
  const [selectedState, setSelectedState] = useState("");
  const [loanAmount, setLoanAmount] = useState(350000);
  const [rateData, setRateData] = useState<RateApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    if (!selectedState) {
      setRateData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rates?state=${selectedState}&loanAmount=${loanAmount}`);

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || "Failed to fetch mortgage rates");
      }

      const data = (await response.json()) as RateApiResponse;
      setRateData(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setRateData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedState, loanAmount]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      void fetchRates();
    }, 300);

    return (): void => {
      clearTimeout(debounceTimer);
    };
  }, [fetchRates]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Mortgage Rate Finder</h1>
        <p className="mt-3 text-lg text-gray-600">
          Compare today&apos;s mortgage rates across different terms for your location
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
          <LoanAmountInput loanAmount={loanAmount} onLoanAmountChange={setLoanAmount} />
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          {error}
        </div>
      )}

      {!selectedState && !loading && <EmptyState />}

      {rateData && !loading && <RateResults rateData={rateData} />}
    </div>
  );
}
