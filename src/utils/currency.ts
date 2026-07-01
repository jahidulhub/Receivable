export const formatCurrency = (amount: number, currency: string = '৳'): string => {
  return `${currency} ${amount.toLocaleString('en-BD')}`;
};

export const parseCurrency = (input: string): number => {
  const cleaned = input.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};
