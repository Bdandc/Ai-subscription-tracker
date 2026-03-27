export const CURRENCY_SYMBOLS: Record<string, string> = {
  'GBP': '£',
  'USD': '$',
  'EUR': '€',
  'JPY': '¥',
};

// Fixed rates for demo purposes (to GBP)
export const EXCHANGE_RATES: Record<string, number> = {
  'GBP': 1.0,
  'USD': 0.79, // 1 USD = 0.79 GBP
  'EUR': 0.83, // 1 EUR = 0.83 GBP
  'JPY': 0.0052, // 1 JPY = 0.0052 GBP
};
