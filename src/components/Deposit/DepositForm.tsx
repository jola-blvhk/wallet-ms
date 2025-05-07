import { useState } from "react";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import DepositModal from "./DepositModal";

export default function DepositForm() {
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
        <h3 className="font-semibold mb-2">Deposit</h3>
        <div className="flex items-center space-x-2 mb-2">
          <BanknotesIcon className="h-5 w-5 text-green-500" />
          <input
            type="number"
            placeholder="Amount"
            className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Deposit
        </button>
      </form>

      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
