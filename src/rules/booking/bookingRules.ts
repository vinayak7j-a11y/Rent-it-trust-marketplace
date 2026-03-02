export function calculateRentalFee(days: number): number {
  return days * 150000; // ₹1500 per day in paise
}

export function baseDeposit(): number {
  return 500000; // ₹5000 in paise
}