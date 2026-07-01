export type TransactionType = 'DUE' | 'PAYMENT';

export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date: Date;
  createdAt: Date;
}

export interface CreateTransactionInput {
  customerId: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date?: Date;
}
