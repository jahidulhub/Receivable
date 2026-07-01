import { db } from '../database/db';
import { Transaction, CreateTransactionInput } from '../models/transaction';
import { v4 as uuidv4 } from 'uuid';

export const createTransaction = async (input: CreateTransactionInput): Promise<Transaction> => {
  const transaction: Transaction = {
    id: uuidv4(),
    customerId: input.customerId,
    type: input.type,
    amount: input.amount,
    note: input.note,
    date: input.date || new Date(),
    createdAt: new Date(),
  };

  await db.transactions.add(transaction);
  return transaction;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return db.transactions.toArray();
};

export const getTransactionsByCustomerId = async (customerId: string): Promise<Transaction[]> => {
  const transactions = await db.transactions.where('customerId').equals(customerId).toArray();
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await db.transactions.delete(id);
};

export const updateTransaction = async (id: string, updates: Partial<CreateTransactionInput>): Promise<void> => {
  await db.transactions.update(id, updates);
};
