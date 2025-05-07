import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import TransferModal from "./TransferModal";

interface TransferFormProps {
  balance: number;
}

export default function TransferForm({ balance = 0 }: TransferFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <form
        onSubmit={handleOpenModal}
        className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 dark:text-white"
      >
        <h3 className="font-semibold mb-2">Transfer to Card</h3>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownIcon className="h-5 w-5 text-purple-500" />
            <input
              type="number"
              placeholder="Amount"
              className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Available: ${(balance / 100).toFixed(2)}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 mt-2"
        >
          Transfer
        </button>
      </form>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={balance}
      />
    </>
  );
}
