import { expect, test } from 'vitest';

// Simple test for compound interest calculation (logic from component)
function calculateCompoundInterest(principal, rate, years, monthlyContribution) {
  let total = principal;
  const monthlyRate = (rate / 100) / 12;
  const totalMonths = years * 12;

  for (let month = 1; month <= totalMonths; month++) {
    total = total * (1 + monthlyRate) + monthlyContribution;
  }
  return parseFloat(total.toFixed(2));
}

test('compound interest calculation without monthly contribution', () => {
  const result = calculateCompoundInterest(1000, 5, 10, 0);
  // 1000 * (1 + 0.05/12)^(10*12) should be approx 1647.01
  expect(result).toBeCloseTo(1647.01, 1);
});

test('compound interest calculation with monthly contribution', () => {
  const result = calculateCompoundInterest(1000, 5, 10, 100);
  // With monthly contribution of 100€
  expect(result).toBeGreaterThan(1647.01);
  expect(result).toBeCloseTo(17175.24, 1);
});
