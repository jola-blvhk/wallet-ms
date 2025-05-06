import { BanknotesIcon } from "@heroicons/react/24/solid";

export default function DepositForm() {
  return (
    <form className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 dark:text-white">
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
  );
}
