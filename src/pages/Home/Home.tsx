import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { CustomerList } from '../../components/CustomerList/CustomerList';
import { formatCurrency } from '../../utils/currency';
import { db } from '../../database/db';
import { Customer } from '../../models/customer';
import { Transaction } from '../../models/transaction';
import { createCustomer, getCustomers, searchCustomers } from '../../services/customerService';
import { getTransactions } from '../../services/transactionService';
import { calculateOutstanding } from '../../utils/calculation';
import { RouteType, RouteParams } from '../../app/routes';

interface HomeProps {
  onNavigate: (route: RouteType, params?: RouteParams) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, customers]);

  useEffect(() => {
    calculateTotal();
  }, [transactions, customers]);

  const loadData = async () => {
    const customersData = await getCustomers();
    const transactionsData = await getTransactions();
    setCustomers(customersData);
    setTransactions(transactionsData);
  };

  const filterCustomers = async () => {
    if (searchQuery.trim()) {
      const results = await searchCustomers(searchQuery);
      setFilteredCustomers(results);
    } else {
      setFilteredCustomers(customers);
    }
  };

  const calculateTotal = () => {
    const total = calculateOutstanding(transactions);
    setTotalOutstanding(total);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) return;

    try {
      await createCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address || undefined,
      });
      setNewCustomer({ name: '', phone: '', address: '' });
      setIsAddModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header title="Receivable" />

      <main className="max-w-md mx-auto">
        <div className="px-4 py-8 text-center border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Outstanding</p>
          <p className="text-4xl font-bold">{formatCurrency(totalOutstanding)}</p>
        </div>

        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex gap-2">
          <input
            type="text"
            placeholder="Search customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Button onClick={() => setIsAddModalOpen(true)} size="md">
            Add
          </Button>
        </div>

        <CustomerList
          customers={filteredCustomers}
          transactions={transactions}
          onCustomerClick={(customerId) => {
            onNavigate('customer-detail', { customerId });
          }}
        />

        <div className="fixed bottom-6 right-6">
          <Button
            variant="secondary"
            onClick={() => onNavigate('settings')}
            className="rounded-full w-14 h-14 flex items-center justify-center text-lg p-0"
          >
            ⚙️
          </Button>
        </div>
      </main>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer"
        actions={
          <button
            onClick={handleAddCustomer}
            className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            Save
          </button>
        }
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Customer name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone *</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Address (optional)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
