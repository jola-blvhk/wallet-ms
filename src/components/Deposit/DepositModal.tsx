import { useUser } from "@/contexts/UserContext";
import QUERYKEYS from "@/lib/queryKeys";
import { TransactionType, useRecordTransaction } from "@/services/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const { mainWalletId } = useUser();
  const recordTransaction = useRecordTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const payload = {
      amount: amount,
      precision: 100,
      reference: `txn_${Date.now()}`,
      description: description || "Deposit to main wallet",
      currency: "USD",
      source: "@WorldUSD",
      destination: mainWalletId,
      skip_queue: true,
      allow_overdraft: true,
      meta_data: {
        transaction_type: "deposit" as TransactionType,
        channel: "bank_transfer",
      },
    };

    recordTransaction.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERYKEYS.getWalletBalance(mainWalletId),
        });
        toast.success("Deposit successful! 🎉");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to process deposit. Please try again.");
        console.error("Transaction failed:", error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Deposit to Main Wallet
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white mt-1"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white mt-1"
                placeholder="Optional description"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Deposit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
