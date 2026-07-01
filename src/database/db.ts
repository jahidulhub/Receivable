import Dexie, { Table } from 'dexie';
import { Customer } from '../models/customer';
import { Transaction } from '../models/transaction';
import { CompanySettings } from '../models/settings';

export class ReceivableDB extends Dexie {
  customers!: Table<Customer>;
  transactions!: Table<Transaction>;
  settings!: Table<CompanySettings>;

  constructor() {
    super('ReceivableDB');
    this.version(1).stores({
      customers: '++id, name',
      transactions: '++id, customerId, date',
      settings: '++id',
    });
  }
}

export const db = new ReceivableDB();
