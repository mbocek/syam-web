import { expect, test } from 'vitest';

function calculateMonthlyPayment(amount, rate, years) {
  const monthlyRate = (rate / 100) / 12;
  const numberOfPayments = years * 12;
  if (monthlyRate === 0) return amount / numberOfPayments;
  const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return payment;
}

function calculateMortgageSchedule(amount, rate, years) {
  let balance = amount;
  const monthlyRate = (rate / 100) / 12;
  const numberOfPayments = years * 12;
  const payment = calculateMonthlyPayment(amount, rate, years);
  
  let data = [];
  let totalInterest = 0;
  
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  for (let m = 1; m <= numberOfPayments; m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = payment - interestPayment;
    
    balance -= principalPayment;
    if (balance < 0) balance = 0;

    yearlyPrincipal += principalPayment;
    yearlyInterest += interestPayment;
    totalInterest += interestPayment;

    if (m % 12 === 0 || m === numberOfPayments) {
      data.push({
        year: Math.ceil(m / 12),
        principal: parseFloat(yearlyPrincipal.toFixed(2)),
        interest: parseFloat(yearlyInterest.toFixed(2)),
        balance: parseFloat(balance.toFixed(2))
      });
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }
  }

  return {
    breakdown: data,
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalRepayment: parseFloat((amount + totalInterest).toFixed(2)),
    monthlyPayment: parseFloat(payment.toFixed(2))
  };
}

test('mortgage monthly payment calculation', () => {
  const amount = 1000000;
  const rate = 4.5;
  const years = 30;
  
  const payment = calculateMonthlyPayment(amount, rate, years);
  // For 1,000,000 at 4.5% for 30 years, monthly payment is approx 5066.85
  expect(payment).toBeCloseTo(5066.85, 1);
});

test('mortgage schedule calculation', () => {
  const amount = 1000000;
  const rate = 4.5;
  const years = 30;
  
  const result = calculateMortgageSchedule(amount, rate, years);
  
  expect(result.monthlyPayment).toBeCloseTo(5066.85, 1);
  expect(result.totalRepayment).toBeCloseTo(1824067.12, 0); // 5066.85 * 360 = 1824066 (roughly)
  expect(result.totalInterest).toBeCloseTo(824067.12, 0);
  
  // First year
  expect(result.breakdown[0].year).toBe(1);
  // Total balance at the end of 30 years should be 0
  expect(result.breakdown[29].balance).toBe(0);
});
