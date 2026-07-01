import { Customer } from './customer';
import { Transaction } from './transaction';

export interface CompanySettings {
  id: string;
  name: string;
  phone: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanySettingsInput {
  name: string;
  phone: string;
  address?: string;
}

export interface BackupData {
  version: number;
  appName: string;
  backup: {
    date: string;
    hash: string;
  };
  company: CompanySettings | null;
  customers: Customer[];
  transactions: Transaction[];
}
