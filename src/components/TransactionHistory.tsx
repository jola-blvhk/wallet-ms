/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BanknotesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import { format } from "date-fns";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import QUERYKEYS from "@/lib/queryKeys";
import { useUser } from "@/contexts/UserContext";



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
  const { mainWalletId, cardWalletId } = useUser();
  const walletId = selectedWallet === "main" ? mainWalletId : cardWalletId;
  const { data: transactions = [], isPending } = useQuery<Transaction[], Error>(
    {
      queryKey: QUERYKEYS.getWalletTransactions(selectedWallet),
      queryFn: async () => {
        const response = await api.post("/search/transactions", {
          q: walletId,
          query_by: "source",
        });
        return response.data.hits.map((hit: any) => hit.document);
      },
    }
  );

  // const searchTransactions = useSearchTransactions();

  // const refreshTransactions = useCallback(() => {
  //   const walletId =
  //     selectedWallet === "main" ? MAIN_WALLET_ID : CARD_WALLET_ID;
  //   searchTransactions.mutate(
  //     {
  //       q: walletId,
  //       query_by: "source",
  //     },
  //     {
  //       onSuccess: (response) => {
  //         const transactionList = response.data.hits.map(
  //           (hit: any) => hit.document
  //         );
  //         setTransactions(transactionList);
  //       },
  //       onError: (error) => {
  //         console.error("Failed to fetch transactions:", error);
  //       },
  //     }
  //   );
  // }, [selectedWallet, searchTransactions]);
  // useEffect(() => {
  //   refreshTransactions();
  // }, [refreshTransactions]);

  const getTransactionIcon = (status: string, destination: string) => {
    if (destination === cardWalletId) {
      return <ArrowDownIcon className="h-5 w-5 text-purple-500" />;
    }
    if (destination === mainWalletId) {
      return <BanknotesIcon className="h-5 w-5 text-green-500" />;
    }
    return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
  };

  const getTransactionType = (status: string, destination: string) => {
    if (destination === cardWalletId) return "Transfer";
    if (destination === mainWalletId) return "Deposit";
    return "Withdraw";
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

      {isPending ? (
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
                    : ${transaction.amount.toFixed(2)}
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
                {format(
                  new Date(parseInt(transaction.created_at, 10) * 1000),
                  "MMM dd, yyyy HH:mm"
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
