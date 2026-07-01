import React from 'react';
import { Customer } from '../../models/customer';
import { CustomerItem } from '../CustomerItem/CustomerItem';
import { Transaction } from '../../models/transaction';
import { calculateOutstanding } from '../../utils/calculation';

interface CustomerListProps {
  customers: Customer[];
  transactions: Transaction[];
  onCustomerClick: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  transactions,
  onCustomerClick,
}) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No customers yet</p>
        <p className="text-sm mt-2">Click "Add" to create your first customer</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {customers.map((customer) => {
        const customerTransactions = transactions.filter((t) => t.customerId === customer.id);
        const outstanding = calculateOutstanding(customerTransactions);
        return (
          <CustomerItem
            key={customer.id}
            customer={customer}
            outstanding={outstanding}
            onClick={() => onCustomerClick(customer.id)}
          />
        );
      })}
    </div>
  );
};
