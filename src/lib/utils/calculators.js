/**
 * Pure calculation helpers for the compound-interest and mortgage calculators.
 * Numbers are returned as `number` (not strings) so callers can format as needed.
 */

export function calculateCompoundInterest({ principal, rate, years, monthlyContribution = 0, frequency = 12 }) {
  const compoundingPeriodRate = rate / 100 / frequency;
  const totalMonths = years * 12;
  const monthsPerCompounding = 12 / frequency;

  let total = principal;
  let yearContributions = 0;
  let yearInterest = 0;
  const breakdown = [];

  for (let month = 1; month <= totalMonths; month++) {
    total += monthlyContribution;
    yearContributions += monthlyContribution;

    const before = total;
    if (month % monthsPerCompounding === 0) {
      total *= 1 + compoundingPeriodRate;
    }
    yearInterest += total - before;

    if (month % 12 === 0) {
      breakdown.push({
        year: month / 12,
        totalContributions: round(yearContributions),
        totalInterest: round(yearInterest),
        balance: round(total)
      });
      yearContributions = 0;
      yearInterest = 0;
    }
  }

  return { total: round(total), breakdown };
}

export function calculateCompoundInterestWithVariance(params) {
  const { rate, variance = 0 } = params;
  const base = calculateCompoundInterest(params);

  if (!variance) {
    return { base, low: base, high: base, mergedBreakdown: base.breakdown };
  }

  const low = calculateCompoundInterest({ ...params, rate: rate - variance });
  const high = calculateCompoundInterest({ ...params, rate: rate + variance });

  const mergedBreakdown = base.breakdown.map((row, i) => ({
    ...row,
    lowInterest: low.breakdown[i].totalInterest,
    highInterest: high.breakdown[i].totalInterest,
    lowBalance: low.breakdown[i].balance,
    highBalance: high.breakdown[i].balance
  }));

  return { base, low, high, mergedBreakdown };
}

export function calculateMonthlyPayment(amount, rate, years) {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  if (monthlyRate === 0) return amount / payments;
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
}

export function calculateMortgageSchedule({ amount, rate, years }) {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  const payment = calculateMonthlyPayment(amount, rate, years);

  let balance = amount;
  let totalInterest = 0;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;
  const breakdown = [];

  for (let m = 1; m <= payments; m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = payment - interestPayment;

    balance = Math.max(0, balance - principalPayment);
    yearlyPrincipal += principalPayment;
    yearlyInterest += interestPayment;
    totalInterest += interestPayment;

    if (m % 12 === 0 || m === payments) {
      breakdown.push({
        year: Math.ceil(m / 12),
        principal: round(yearlyPrincipal),
        interest: round(yearlyInterest),
        balance: round(balance)
      });
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }
  }

  return {
    breakdown,
    totalInterest: round(totalInterest),
    totalRepayment: round(amount + totalInterest),
    monthlyPayment: round(payment)
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}
