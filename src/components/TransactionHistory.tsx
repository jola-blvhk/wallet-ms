import {
  BanknotesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useSearchTransactions } from "@/services/mutations";
import { format } from "date-fns";

const MAIN_WALLET_ID = "bln_cd182069-a1a6-4305-b2e8-d1949da22bdb";
const CARD_WALLET_ID = "bln_5a409804-08eb-43c9-bb7b-3d56a1c50f8e";

export interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  currency: string;
  description: string;
  destination: string;
  source: string;
  status: "APPLIED" | "VOID";
  transaction_id: string;
  meta_data: string;
  reference: string;
  precise_amount: number;
  precision: number;
}

export interface SearchResponse {
  hits: Array<{
    document: Transaction;
  }>;
  found: number;
  page: number;
}

export default function TransactionHistory() {
  const [selectedWallet, setSelectedWallet] = useState<"main" | "card">("main");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const searchTransactions = useSearchTransactions();

  useEffect(() => {
    const walletId =
      selectedWallet === "main" ? MAIN_WALLET_ID : CARD_WALLET_ID;
    searchTransactions.mutate(
      {
        q: walletId,
        query_by: "source",
      },
      {
        onSuccess: (response) => {
          const transactionList = response.data.hits.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (hit: any) => hit.document
          );
          setTransactions(transactionList);
        },
        onError: (error) => {
          console.error("Failed to fetch transactions:", error);
        },
      }
    );
  }, [selectedWallet]);

  const getTransactionIcon = (status: string, destination: string) => {
    if (destination === CARD_WALLET_ID) {
      return <ArrowDownIcon className="h-5 w-5 text-purple-500" />;
    }
    if (destination === "@WorldUSD") {
      return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
    }
    return <BanknotesIcon className="h-5 w-5 text-green-500" />;
  };

  const getTransactionType = (status: string, destination: string) => {
    if (destination === CARD_WALLET_ID) return "Transfer";
    if (destination === "@WorldUSD") return "Withdraw";
    return "Deposit";
  };

  return (
    <div className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Transaction History</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedWallet("main")}
            className={`px-3 py-1 rounded-md ${
              selectedWallet === "main"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Main Wallet
          </button>
          <button
            onClick={() => setSelectedWallet("card")}
            className={`px-3 py-1 rounded-md ${
              selectedWallet === "card"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Card Wallet
          </button>
        </div>
      </div>

      {searchTransactions.isPending ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <li
              key={transaction.transaction_id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {getTransactionIcon(
                  transaction.status,
                  transaction.destination
                )}
                <div className="flex flex-col">
                  <span className="text-sm">
                    {getTransactionType(
                      transaction.status,
                      transaction.destination
                    )}
                    : ${(transaction.amount / 100).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.description}
                  </span>
                  <span className="text-xs text-gray-400">
                    {transaction.status}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
