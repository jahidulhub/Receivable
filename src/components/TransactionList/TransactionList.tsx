import React from 'react';
import { Transaction } from '../../models/transaction';
import { formatCurrency } from '../../utils/currency';
import { getRelativeDate } from '../../utils/date';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (transactionId: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No transactions yet</p>
      </div>
    );
  }

  const grouped = new Map<string, Transaction[]>();
  transactions.forEach((txn) => {
    const dateKey = getRelativeDate(new Date(txn.date));
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(txn);
  });

  return (
    <div>
      {Array.from(grouped.entries()).map(([date, txns]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 py-3 px-4">
            {date}
          </h3>
          {txns.map((txn) => (
            <div
              key={txn.id}
              className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="font-medium text-base">
                  {txn.type === 'DUE' ? 'Sale Due' : 'Payment Received'}
                </p>
                {txn.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Note: {txn.note}</p>}
              </div>
              <div className="text-right ml-3">
                <p
                  className={`font-semibold ${
                    txn.type === 'DUE' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {txn.type === 'DUE' ? '+' : '-'}{formatCurrency(txn.amount)}
                </p>
                {onDelete && (
                  <button
                    onClick={() => onDelete(txn.id)}
                    className="text-xs text-gray-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
