import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { TransactionList } from '../../components/TransactionList/TransactionList';
import { formatCurrency } from '../../utils/currency';
import { Customer } from '../../models/customer';
import { Transaction } from '../../models/transaction';
import { getCustomerById } from '../../services/customerService';
import { getTransactionsByCustomerId, createTransaction, deleteTransaction } from '../../services/transactionService';
import { calculateOutstanding } from '../../utils/calculation';
import { RouteType, RouteParams } from '../../app/routes';

interface CustomerDetailProps {
  customerId?: string;
  onNavigate: (route: RouteType, params?: RouteParams) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customerId, onNavigate }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [outstanding, setOutstanding] = useState(0);
  const [isAddDueModalOpen, setIsAddDueModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [dueAmount, setDueAmount] = useState('');
  const [dueNote, setDueNote] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadData();
    }
  }, [customerId]);

  const loadData = async () => {
    try {
      if (!customerId) return;
      const customerData = await getCustomerById(customerId);
      setCustomer(customerData || null);

      const transactionsData = await getTransactionsByCustomerId(customerId);
      setTransactions(transactionsData);
      setOutstanding(calculateOutstanding(transactionsData));
    } catch (error) {
      console.error('Failed to load customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueAmount.trim() || !customerId) return;

    try {
      await createTransaction({
        customerId,
        type: 'DUE',
        amount: parseFloat(dueAmount),
        note: dueNote || undefined,
      });
      setDueAmount('');
      setDueNote('');
      setIsAddDueModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to add due:', error);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount.trim() || !customerId) return;

    try {
      await createTransaction({
        customerId,
        type: 'PAYMENT',
        amount: parseFloat(paymentAmount),
        note: paymentNote || undefined,
      });
      setPaymentAmount('');
      setPaymentNote('');
      setIsPaymentModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(transactionId);
        loadData();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header
        showBackButton
        onBackClick={() => onNavigate('home')}
        title={customer.name}
        subtitle={`${customer.phone}${customer.address ? ` • ${customer.address}` : ''}`}
      />

      <main className="max-w-md mx-auto">
        <div className="px-4 py-8 text-center border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Outstanding</p>
          <p className="text-4xl font-bold">{formatCurrency(outstanding)}</p>
        </div>

        <div className="px-4 py-6 flex gap-3 border-b border-gray-100 dark:border-gray-800">
          <Button fullWidth onClick={() => setIsAddDueModalOpen(true)}>
            ↓ Add Due
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setIsPaymentModalOpen(true)}>
            ↑ Payment
          </Button>
        </div>

        <div>
          <h2 className="px-4 py-4 text-lg font-semibold">Transaction History</h2>
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>

      <Modal
        isOpen={isAddDueModalOpen}
        onClose={() => setIsAddDueModalOpen(false)}
        title="Add Due"
        actions={
          <button
            onClick={handleAddDue}
            className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            Save
          </button>
        }
      >
        <form onSubmit={handleAddDue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount *</label>
            <input
              type="number"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Note</label>
            <textarea
              value={dueNote}
              onChange={(e) => setDueNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Optional note"
              rows={3}
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        actions={
          <button
            onClick={handleAddPayment}
            className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            Save
          </button>
        }
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount *</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Note</label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Optional note"
              rows={3}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
