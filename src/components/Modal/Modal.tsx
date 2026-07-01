import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex gap-3">
          {actions}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
