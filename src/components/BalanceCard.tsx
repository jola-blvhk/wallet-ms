import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface BalanceCardProps {
  label: string;
  balance?: number;
}

export default function BalanceCard({ label, balance = 0 }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance / 100);
  };

  return (
    <div
      className="p-6 shadow-lg rounded-xl border-l-4 border-green-400 
      bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{label}</h2>
        <button
          onClick={toggleBalanceVisibility}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          aria-label={isBalanceVisible ? "Hide Balance" : "Show Balance"}
        >
          {isBalanceVisible ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <EyeSlashIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="text-2xl font-bold text-green-600 dark:text-green-300">
        {isBalanceVisible ? (
          formatBalance(balance)
        ) : (
          <span className="text-2xl tracking-wider">••••••</span>
        )}
      </p>
      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
        Available balance
      </p>
    </div>
  );
}
