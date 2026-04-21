import { expect, test } from 'vitest';
import {
  calculateCompoundInterest,
  calculateCompoundInterestWithVariance,
  calculateMonthlyPayment,
  calculateMortgageSchedule
} from './calculators.js';

test('compound interest without monthly contribution (monthly compounding)', () => {
  const result = calculateCompoundInterest({ principal: 1000, rate: 5, years: 10 });
  expect(result.total).toBeCloseTo(1647.01, 1);
  expect(result.breakdown[0].totalInterest).toBeCloseTo(51.16, 1);
  expect(result.breakdown[0].totalContributions).toBe(0);
});

test('compound interest with monthly contribution (monthly compounding)', () => {
  const result = calculateCompoundInterest({ principal: 1000, rate: 5, years: 10, monthlyContribution: 100 });
  expect(result.total).toBeCloseTo(17239.94, 1);
  expect(result.breakdown[0].totalContributions).toBe(1200);
  expect(result.breakdown[0].totalInterest).toBeGreaterThan(51.16);
});

test('compound interest with variance', () => {
  const result = calculateCompoundInterestWithVariance({ principal: 1000, rate: 5, variance: 2, years: 10 });

  expect(result.base.total).toBeCloseTo(1647.01, 1);
  expect(result.low.total).toBeCloseTo(1349.35, 1);
  expect(result.high.total).toBeCloseTo(2009.66, 1);

  expect(result.mergedBreakdown[0].lowInterest).toBeCloseTo(30.42, 1);
  expect(result.mergedBreakdown[0].highInterest).toBeCloseTo(72.29, 1);
  expect(result.mergedBreakdown[0].lowBalance).toBeCloseTo(1030.42, 1);
  expect(result.mergedBreakdown[0].highBalance).toBeCloseTo(1072.29, 1);
});

test('compound interest with no variance returns base for all branches', () => {
  const result = calculateCompoundInterestWithVariance({ principal: 1000, rate: 5, variance: 0, years: 5 });
  expect(result.low).toBe(result.base);
  expect(result.high).toBe(result.base);
  expect(result.mergedBreakdown).toBe(result.base.breakdown);
});

test('mortgage monthly payment', () => {
  const payment = calculateMonthlyPayment(1000000, 4.5, 30);
  expect(payment).toBeCloseTo(5066.85, 1);
});

test('mortgage schedule', () => {
  const result = calculateMortgageSchedule({ amount: 1000000, rate: 4.5, years: 30 });

  expect(result.monthlyPayment).toBeCloseTo(5066.85, 1);
  expect(result.totalRepayment).toBeCloseTo(1824067.12, 0);
  expect(result.totalInterest).toBeCloseTo(824067.12, 0);

  expect(result.breakdown[0].year).toBe(1);
  expect(result.breakdown[29].balance).toBe(0);
});

test('mortgage with zero interest rate', () => {
  const payment = calculateMonthlyPayment(120000, 0, 10);
  expect(payment).toBeCloseTo(1000, 2);
});
