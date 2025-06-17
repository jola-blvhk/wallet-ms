import { useUser } from "@/contexts/UserContext";
import QUERYKEYS from "@/lib/queryKeys";
import { TransactionType, useRecordTransaction } from "@/services/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function TransferModal({
  isOpen,
  onClose,
  balance = 0,
}: TransferModalProps) {
  
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const { currencySymbol, currencyPrecision, currencyCode } = useUser();


  const { mainWalletId, cardWalletId } = useUser();
  const recordTransaction = useRecordTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance for transfer");
      return;
    }

    const payload = {
      amount: amount,
      precision: currencyPrecision ?? 100,
      reference: `txn_${Date.now()}`,
      description: description || "Transfer to card wallet",
      currency: "USD",
      source: mainWalletId,
      destination: cardWalletId,
      allow_overdraft: false,
      skip_queue: true,
      meta_data: {
        transaction_type: "transfer" as TransactionType,
        channel: "internal_transfer",
      },
    };

    recordTransaction.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERYKEYS.getWalletBalance(mainWalletId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERYKEYS.getWalletBalance(cardWalletId),
        });
        toast.success("Transfer successful! 🎉");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to process transfer. Please try again.");
        console.error("Transfer failed:", error);
      },
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center ${
        !isOpen && "hidden"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Transfer to Card Wallet
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Amount ({currencyCode})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white mt-1"
                min="0"
                max={(balance / (currencyPrecision ?? 100)).toFixed(2)}
                step="0.01"
                required
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Available balance: {currencySymbol}{(balance / (currencyPrecision ?? 100)).toFixed(2)}
              </span>
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
                disabled={
                  recordTransaction.isPending ||
                  amount <= 0 ||
                  amount * 100 > balance
                }
                className="flex-1 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recordTransaction.isPending ? "Processing..." : "Transfer"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={recordTransaction.isPending}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
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
