import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { CompanySettings } from '../../models/settings';
import { db } from '../../database/db';
import { downloadBackup, importBackup, restoreBackup } from '../../services/backupService';
import { verifyHash } from '../../services/hashService';
import { RouteType, RouteParams } from '../../app/routes';

interface SettingsProps {
  onNavigate: (route: RouteType, params?: RouteParams) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedBackup, setImportedBackup] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'invalid'>('pending');

  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    const settings = await db.settings.toArray();
    if (settings.length > 0) {
      const companyData = settings[0];
      setCompany(companyData);
      setFormData({
        name: companyData.name,
        phone: companyData.phone,
        address: companyData.address || '',
      });
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (company) {
        await db.settings.update(company.id, {
          ...formData,
          updatedAt: new Date(),
        });
      } else {
        await db.settings.add({
          id: '1',
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      loadCompanySettings();
      alert('Company information saved!');
    } catch (error) {
      console.error('Failed to save company settings:', error);
    }
  };

  const handleBackupClick = async () => {
    try {
      await downloadBackup();
      alert('Backup downloaded successfully!');
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const backup = await importBackup(file);
          setImportedBackup(backup);
          setIsImportModalOpen(true);
          const { backup: backupInfo, ...backupData } = backup;
          const isValid = verifyHash(backupData, backupInfo.hash);
          setVerificationStatus(isValid ? 'verified' : 'invalid');
        } catch (error) {
          console.error('Failed to import backup:', error);
          alert('Invalid backup file');
        }
      }
    };
    input.click();
  };

  const handleRestoreBackup = async () => {
    if (!importedBackup) return;
    if (!window.confirm('This will replace all your current data. Are you sure?')) return;

    try {
      await restoreBackup(importedBackup);
      setIsImportModalOpen(false);
      setImportedBackup(null);
      alert('Backup restored successfully!');
      loadCompanySettings();
    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Failed to restore backup');
    }
  };

  const handleEraseAllData = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete all customers, transactions, and company information. This cannot be undone.')) return;
    if (!window.confirm('Click OK one more time to confirm deletion of all data.')) return;

    try {
      await db.customers.clear();
      await db.transactions.clear();
      await db.settings.clear();
      setCompany(null);
      setFormData({ name: '', phone: '', address: '' });
      alert('All data has been erased');
    } catch (error) {
      console.error('Failed to erase data:', error);
      alert('Failed to erase data');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header
        showBackButton
        onBackClick={() => onNavigate('home')}
        title="Settings"
      />

      <main className="max-w-md mx-auto pb-8">
        <div className="px-4 py-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Company Details</h2>
          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your business name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Address (optional)"
              />
            </div>
            <Button fullWidth type="submit">Save Changes</Button>
          </form>
        </div>

        <div className="px-4 py-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Backup & Import</h2>
          <div className="space-y-3">
            <Button fullWidth variant="secondary" onClick={handleBackupClick}>
              📥 Export Backup (JSON)
            </Button>
            <Button fullWidth variant="secondary" onClick={handleImportClick}>
              📤 Import Backup (JSON)
            </Button>
          </div>
        </div>

        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This permanently deletes:
            <ul className="list-disc list-inside mt-2">
              <li>Customers</li>
              <li>Transactions</li>
              <li>Company information</li>
            </ul>
          </p>
          <Button fullWidth variant="danger" onClick={handleEraseAllData}>
            🗑️ Erase All Data
          </Button>
        </div>
      </main>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Verification"
        actions={
          <button
            onClick={handleRestoreBackup}
            disabled={verificationStatus !== 'verified'}
            className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Data
          </button>
        }
      >
        {importedBackup && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Backup Date</p>
              <p className="font-semibold">{importedBackup.backup.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hash Code</p>
              <p className="font-mono text-sm font-semibold">{importedBackup.backup.hash}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verification Status</p>
              <p
                className={`font-semibold ${
                  verificationStatus === 'verified' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {verificationStatus === 'verified' ? '✓ Verified' : '✗ Invalid'}
              </p>
            </div>
            {importedBackup.company && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                <p className="font-semibold">{importedBackup.company.name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
              <p className="font-semibold">{importedBackup.customers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="font-semibold">{importedBackup.transactions.length}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Settings;
