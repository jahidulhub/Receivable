import React from 'react';
import { Customer } from '../../models/customer';
import { formatCurrency } from '../../utils/currency';

interface CustomerItemProps {
  customer: Customer;
  outstanding: number;
  onClick: () => void;
}

export const CustomerItem: React.FC<CustomerItemProps> = ({
  customer,
  outstanding,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4"
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-base">{customer.name}</h3>
        <span className="font-semibold">{formatCurrency(outstanding)}</span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {customer.phone}
        {customer.address && ` • ${customer.address}`}
      </div>
    </button>
  );
};
