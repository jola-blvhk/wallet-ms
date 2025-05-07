import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import WithdrawModal from "./WithdrawModal";

interface WithdrawFormProps {
  balance: number;
}

export default function WithdrawForm({ balance = 0 }: WithdrawFormProps) {
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
        <h3 className="font-semibold mb-2">Withdraw</h3>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpIcon className="h-5 w-5 text-red-500" />
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
          className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
        >
          Withdraw
        </button>
      </form>

      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={balance}
      />
    </>
  );
}
