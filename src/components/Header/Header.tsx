import React from 'react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  subtitle,
}) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="text-2xl leading-none hover:opacity-70 transition-opacity"
              aria-label="Go back"
            >
              ←
            </button>
          ) : (
            <div />
          )}
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
          <div className="w-6" />
        </div>
        {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
      </div>
    </header>
  );
};
