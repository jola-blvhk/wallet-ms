import { useState } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import TransferModal from "./TransferModal";

interface TransferFormProps {
  balance: number;
}

export default function TransferForm({ balance = 0 }: TransferFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 
        border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400
        hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1
        group relative overflow-hidden"
      >
        {/* Hover effect background */}
        <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg 
            group-hover:bg-purple-200 dark:group-hover:bg-purple-800 
            ring-2 ring-purple-100 dark:ring-purple-800 group-hover:ring-purple-300 
            dark:group-hover:ring-purple-700 transition-all duration-200"
            >
              <ArrowDownIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                Transfer to Card
              </h3>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400">
                Available: ${(balance / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Click indicator */}
          <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-200">
            Click to transfer →
          </span>
        </div>
      </button>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={balance}
      />
    </>
  );
}
