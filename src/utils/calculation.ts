import { Transaction } from '../models/transaction';

export const calculateOutstanding = (transactions: Transaction[]): number => {
  let outstanding = 0;

  transactions.forEach((txn) => {
    if (txn.type === 'DUE') {
      outstanding += txn.amount;
    } else if (txn.type === 'PAYMENT') {
      outstanding -= txn.amount;
    }
  });

  return Math.max(outstanding, 0);
};

export const calculateTotalDue = (transactions: Transaction[]): number => {
  return transactions
    .filter((txn) => txn.type === 'DUE')
    .reduce((sum, txn) => sum + txn.amount, 0);
};

export const calculateTotalPayment = (transactions: Transaction[]): number => {
  return transactions
    .filter((txn) => txn.type === 'PAYMENT')
    .reduce((sum, txn) => sum + txn.amount, 0);
};
