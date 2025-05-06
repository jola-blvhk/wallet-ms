import {
  BanknotesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";

export default function TransactionHistory() {
  return (
    <div className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 dark:text-white">
      <h3 className="font-semibold mb-2">Transaction History</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex items-center space-x-2">
          <BanknotesIcon className="h-5 w-5 text-green-500" />
          <span>Deposit: $500 - Jan 10</span>
        </li>
        <li className="flex items-center space-x-2">
          <ArrowUpIcon className="h-5 w-5 text-red-500" />
          <span>Withdraw: $100 - Jan 12</span>
        </li>
        <li className="flex items-center space-x-2">
          <ArrowDownIcon className="h-5 w-5 text-purple-500" />
          <span>Transfer: $50 - Jan 14</span>
        </li>
      </ul>
    </div>
  );
}
