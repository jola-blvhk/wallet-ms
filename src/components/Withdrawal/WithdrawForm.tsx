import { useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import WithdrawModal from "./WithdrawModal";

interface WithdrawFormProps {
  balance: number;
}

export default function WithdrawForm({ balance = 0 }: WithdrawFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 
        border-2 border-transparent hover:border-red-500 dark:hover:border-red-400
        hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1
        group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="p-3 bg-red-100 dark:bg-red-900 rounded-lg 
            group-hover:bg-red-200 dark:group-hover:bg-red-800 
            ring-2 ring-red-100 dark:ring-red-800 group-hover:ring-red-300 
            dark:group-hover:ring-red-700 transition-all duration-200"
            >
              <ArrowUpIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-left duration-200">
                Withdraw
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available: ${(balance / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
            Click to withdraw →
          </span>
        </div>
      </button>

      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={balance}
      />
    </>
  );
}
