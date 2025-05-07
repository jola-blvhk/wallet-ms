import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function BalanceCard({
  label,
  balance,
}: {
  label: string;
  balance: number;
}) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatBalance = (balance: number) => {
    return `$${(balance / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{label}</h2>
        <button
          onClick={toggleBalanceVisibility}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label={isBalanceVisible ? "Hide Balance" : "Show Balance"}
        >
          {isBalanceVisible ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <EyeSlashIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        {isBalanceVisible ? (
          formatBalance(balance || 0)
        ) : (
          <span className="text-2xl tracking-wider">••••••</span>
        )}
      </p>
    </div>
  );
}
