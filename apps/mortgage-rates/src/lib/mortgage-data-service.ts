import type { MortgageRate, MortgageRateResponse } from "@/types/mortgage";
import { US_STATES } from "@/types/mortgage";

/**
 * Base national average mortgage rates (as of March 2026).
 * In a production system, these would be fetched from a real-time data provider
 * such as Freddie Mac PMMS, Bankrate, or Zillow Mortgage API.
 */
const BASE_RATES: MortgageRate[] = [
  {
    term: "30-Year Fixed",
    rate: 6.65,
    apr: 6.72,
    description: "Most popular option. Fixed monthly payments over 30 years. Best for long-term homeowners.",
  },
  {
    term: "15-Year Fixed",
    rate: 5.89,
    apr: 5.98,
    description:
      "Lower rate, higher monthly payments. Build equity faster. Best for refinancing or those who can afford higher payments.",
  },
  {
    term: "5/1 ARM",
    rate: 6.12,
    apr: 7.14,
    description:
      "Fixed rate for 5 years, then adjusts annually. Lower initial rate. Best for those planning to move or refinance within 5 years.",
  },
  {
    term: "7/1 ARM",
    rate: 6.28,
    apr: 7.05,
    description:
      "Fixed rate for 7 years, then adjusts annually. Moderate initial savings. Best for medium-term homeowners.",
  },
  {
    term: "FHA 30-Year Fixed",
    rate: 6.18,
    apr: 7.21,
    description:
      "Government-backed loan with lower down payment requirements (3.5%). Includes mortgage insurance premium. Best for first-time buyers.",
  },
  {
    term: "VA 30-Year Fixed",
    rate: 6.05,
    apr: 6.32,
    description:
      "Available to eligible veterans and service members. No down payment or PMI required. Best rates for qualified borrowers.",
  },
];

/**
 * Regional adjustment factors by state.
 * States with higher cost of living or higher demand tend to have slightly
 * different rates. These adjustments simulate real-world regional variation.
 */
const STATE_ADJUSTMENTS: Record<string, number> = {
  AL: -0.08,
  AK: 0.15,
  AZ: 0.03,
  AR: -0.1,
  CA: 0.12,
  CO: 0.05,
  CT: 0.07,
  DE: 0.02,
  FL: 0.04,
  GA: -0.02,
  HI: 0.18,
  ID: 0.01,
  IL: 0.03,
  IN: -0.05,
  IA: -0.09,
  KS: -0.07,
  KY: -0.08,
  LA: -0.06,
  ME: 0.04,
  MD: 0.06,
  MA: 0.08,
  MI: -0.04,
  MN: 0.01,
  MS: -0.11,
  MO: -0.06,
  MT: 0.02,
  NE: -0.07,
  NV: 0.03,
  NH: 0.05,
  NJ: 0.09,
  NM: -0.03,
  NY: 0.11,
  NC: -0.01,
  ND: -0.08,
  OH: -0.05,
  OK: -0.09,
  OR: 0.06,
  PA: 0.02,
  RI: 0.06,
  SC: -0.03,
  SD: -0.08,
  TN: -0.04,
  TX: 0.02,
  UT: 0.04,
  VT: 0.05,
  VA: 0.03,
  WA: 0.08,
  WV: -0.1,
  WI: -0.03,
  WY: -0.05,
};

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function getAdjustedRates(adjustment: number): MortgageRate[] {
  return BASE_RATES.map((baseRate) => ({
    term: baseRate.term,
    rate: roundToTwoDecimals(baseRate.rate + adjustment),
    apr: roundToTwoDecimals(baseRate.apr + adjustment),
    description: baseRate.description,
  }));
}

function getStateName(stateCode: string): string {
  return US_STATES[stateCode] || stateCode;
}

/**
 * Get mortgage rates for a specific US state.
 * Applies regional adjustments to the base national average rates.
 */
export function getMortgageRatesForState(
  stateCode: string,
  loanAmount: number = 350000
): MortgageRateResponse {
  const upperState = stateCode.toUpperCase();
  const adjustment = STATE_ADJUSTMENTS[upperState] ?? 0;

  const adjustedRates = getAdjustedRates(adjustment);

  return {
    location: getStateName(upperState),
    state: upperState,
    rates: adjustedRates,
    lastUpdated: new Date().toISOString(),
    loanAmount,
  };
}

/**
 * Calculate the monthly mortgage payment using the standard amortization formula.
 */
export function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const payment =
    (principal * (monthlyRate * (1 + monthlyRate) ** numPayments)) / ((1 + monthlyRate) ** numPayments - 1);

  return roundToTwoDecimals(payment);
}

/**
 * Get the term length in years from the term name string.
 */
export function getTermYears(term: string): number {
  if (term.includes("30")) return 30;
  if (term.includes("15")) return 15;
  if (term.includes("5/1")) return 30;
  if (term.includes("7/1")) return 30;
  return 30;
}
