import { TransactionType, useRecordTransaction } from "@/services/mutations";
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
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const recordTransaction = useRecordTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amountInCents = amount * 100;

    if (amountInCents > balance) {
      toast.error("Insufficient balance for transfer");
      return;
    }

    const payload = {
      amount: amountInCents,
      precision: 100,
      reference: `txn_${Date.now()}`,
      description: description || "Transfer to card wallet",
      currency: "USD",
      source: "bln_cd182069-a1a6-4305-b2e8-d1949da22bdb", // Main wallet
      destination: "bln_5a409804-08eb-43c9-bb7b-3d56a1c50f8e", // Card wallet
      allow_overdraft: false,
      skip_queue: true,
      meta_data: {
        transaction_type: "transfer" as TransactionType,
        channel: "internal_transfer",
      },
    };

    recordTransaction.mutate(payload, {
      onSuccess: () => {
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
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white mt-1"
                min="0"
                max={(balance / 100).toFixed(2)}
                step="0.01"
                required
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Available balance: ${(balance / 100).toFixed(2)}
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
