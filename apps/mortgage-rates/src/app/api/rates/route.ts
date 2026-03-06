import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { calculateMonthlyPayment, getMortgageRatesForState, getTermYears } from "@/lib/mortgage-data-service";
import { US_STATES } from "@/types/mortgage";

function parseLoanAmount(param: string | null): number {
  if (!param) {
    return 350000;
  }
  return Number(param);
}

/**
 * GET /api/rates
 *
 * Fetches mortgage rates for a specific US state and loan amount.
 *
 * Query parameters:
 *   - state (required): Two-letter US state code (e.g., "CA", "NY", "TX")
 *   - loanAmount (optional): Loan amount in USD (default: 350000)
 *
 * Response: MortgageRateResponse with monthly payment estimates
 */
export async function GET(request: NextRequest): Promise<NextResponse<unknown>> {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");
  const loanAmountParam = searchParams.get("loanAmount");

  if (!state) {
    return NextResponse.json(
      { error: "Missing required parameter: state (two-letter US state code)" },
      { status: 400 }
    );
  }

  const upperState = state.toUpperCase();
  if (!US_STATES[upperState]) {
    return NextResponse.json(
      {
        error: `Invalid state code: "${state}". Please provide a valid two-letter US state code.`,
        validStates: Object.keys(US_STATES),
      },
      { status: 400 }
    );
  }

  const loanAmount = parseLoanAmount(loanAmountParam);
  if (Number.isNaN(loanAmount) || loanAmount <= 0 || loanAmount > 10000000) {
    return NextResponse.json(
      {
        error: "Invalid loanAmount. Must be a positive number up to 10,000,000.",
      },
      { status: 400 }
    );
  }

  const rateData = getMortgageRatesForState(upperState, loanAmount);

  const ratesWithPayments = rateData.rates.map((rate) => {
    const termYears = getTermYears(rate.term);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate.rate, termYears);
    const totalCost = Math.round(monthlyPayment * termYears * 12);
    const totalInterest = totalCost - loanAmount;

    return {
      ...rate,
      monthlyPayment,
      totalInterest,
      totalCost,
      termYears,
    };
  });

  return NextResponse.json({
    ...rateData,
    rates: ratesWithPayments,
  });
}
