import { useState } from "react";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import DepositModal from "./DepositModal";

export default function DepositForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 
        border-2 border-transparent hover:border-green-500 dark:hover:border-green-400
        hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1
        group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-green-50 dark:bg-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="p-3 bg-green-100 dark:bg-green-900 rounded-lg 
            group-hover:bg-green-200 dark:group-hover:bg-green-800 
            ring-2 ring-green-100 dark:ring-green-800 group-hover:ring-green-300 
            dark:group-hover:ring-green-700 transition-all duration-200"
            >
              <BanknotesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 text-left dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                Deposit
              </h3>
              <p className="text-sm text-gray-500 text-left dark:text-gray-400">
                Add funds to your wallet
              </p>
            </div>
          </div>

          <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-200">
            Click to deposit →
          </span>
        </div>
      </button>

      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
