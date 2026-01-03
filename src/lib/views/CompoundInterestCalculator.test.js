import { expect, test } from 'vitest';

// Simple test for compound interest calculation (logic from component)
function calculateCompoundInterest(principal, rate, years, monthlyContribution, frequency = 12) {
  let total = principal;
  const compoundingPeriodRate = (rate / 100) / frequency;
  const totalMonths = years * 12;
  let breakdown = [];
  let currentYearInterest = 0;
  let currentYearContributions = 0;

  for (let month = 1; month <= totalMonths; month++) {
    total += monthlyContribution;
    currentYearContributions += monthlyContribution;

    const balanceBeforeInterest = total;
    if (month % (12 / frequency) === 0) {
      total = total * (1 + compoundingPeriodRate);
    }
    currentYearInterest += (total - balanceBeforeInterest);

    if (month % 12 === 0) {
      breakdown.push({
        year: month / 12,
        totalContributions: parseFloat(currentYearContributions.toFixed(2)),
        totalInterest: parseFloat(currentYearInterest.toFixed(2)),
        balance: parseFloat(total.toFixed(2))
      });
      currentYearInterest = 0;
      currentYearContributions = 0;
    }
  }
  return {
    total: parseFloat(total.toFixed(2)),
    breakdown
  };
}

function calculateWithVariance(principal, rate, variance, years, monthlyContribution, frequency = 12) {
  const base = calculateCompoundInterest(principal, rate, years, monthlyContribution, frequency);
  const low = calculateCompoundInterest(principal, rate - variance, years, monthlyContribution, frequency);
  const high = calculateCompoundInterest(principal, rate + variance, years, monthlyContribution, frequency);

  const mergedBreakdown = base.breakdown.map((row, index) => {
    return {
      ...row,
      lowInterest: low.breakdown[index].totalInterest,
      highInterest: high.breakdown[index].totalInterest,
      lowBalance: low.breakdown[index].balance,
      highBalance: high.breakdown[index].balance
    };
  });

  return {
    base,
    low,
    high,
    mergedBreakdown
  };
}

test('compound interest calculation without monthly contribution (monthly compounding)', () => {
  const result = calculateCompoundInterest(1000, 5, 10, 0, 12);
  // 1000 * (1 + 0.05/12)^(10*12) should be approx 1647.01
  expect(result.total).toBeCloseTo(1647.01, 1);
  expect(result.breakdown[0].totalInterest).toBeCloseTo(51.16, 1);
  expect(result.breakdown[0].totalContributions).toBe(0);
});

test('compound interest calculation with monthly contribution (monthly compounding)', () => {
  const result = calculateCompoundInterest(1000, 5, 10, 100, 12);
  expect(result.total).toBeCloseTo(17239.94, 1);
  expect(result.breakdown[0].totalContributions).toBe(1200);
  expect(result.breakdown[0].totalInterest).toBeGreaterThan(51.16); // Interest on contributions too
});

test('compound interest calculation with variance', () => {
  const result = calculateWithVariance(1000, 5, 2, 10, 0, 12);
  
  // Base at 5%
  expect(result.base.total).toBeCloseTo(1647.01, 1);
  // Low at 3%
  expect(result.low.total).toBeCloseTo(1349.35, 1);
  // High at 7%
  expect(result.high.total).toBeCloseTo(2009.66, 1);

  // Check merged breakdown
  expect(result.mergedBreakdown[0].lowInterest).toBeCloseTo(30.42, 1);
  expect(result.mergedBreakdown[0].highInterest).toBeCloseTo(72.29, 1);
  expect(result.mergedBreakdown[0].lowBalance).toBeCloseTo(1030.42, 1);
  expect(result.mergedBreakdown[0].highBalance).toBeCloseTo(1072.29, 1);
});
