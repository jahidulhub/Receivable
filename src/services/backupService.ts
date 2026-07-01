import { db } from '../database/db';
import { BackupData } from '../models/settings';
import { generateHash } from './hashService';

export const createBackup = async (): Promise<string> => {
  const company = await db.settings.toArray();
  const customers = await db.customers.toArray();
  const transactions = await db.transactions.toArray();

  const backupPayload = {
    version: 1,
    appName: 'Receivable',
    company: company.length > 0 ? company[0] : null,
    customers,
    transactions,
  };

  const hash = generateHash(backupPayload);

  const backup: BackupData = {
    ...backupPayload,
    backup: {
      date: new Date().toISOString(),
      hash,
    },
  };

  return JSON.stringify(backup, null, 2);
};

export const downloadBackup = async (): Promise<void> => {
  const backupData = await createBackup();
  const blob = new Blob([backupData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receivable-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importBackup = async (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content) as BackupData;
        resolve(backup);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const restoreBackup = async (backup: BackupData): Promise<void> => {
  await db.customers.clear();
  await db.transactions.clear();
  await db.settings.clear();

  if (backup.company) {
    await db.settings.add(backup.company);
  }

  if (backup.customers.length > 0) {
    await db.customers.bulkAdd(backup.customers);
  }

  if (backup.transactions.length > 0) {
    await db.transactions.bulkAdd(backup.transactions);
  }
};
