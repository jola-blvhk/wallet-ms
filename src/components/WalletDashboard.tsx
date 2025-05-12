"use client";

import { useState } from "react";
import BalanceCard from "./BalanceCard";
import DepositForm from "./Deposit/DepositForm";
import WithdrawForm from "./Withdrawal/WithdrawForm";
import TransferForm from "./TransferToCard/TransferForm";
import TransactionHistory from "./TransactionHistory";
import { useWalletBalance } from "@/services/queries";
import { useUser } from "@/contexts/UserContext";

export default function WalletDashboard() {
  // Get wallet IDs from UserContext instead of hardcoding them
  const { mainWalletId, cardWalletId } = useUser();

  // Use the IDs from context
  const { data: mainBalance } = useWalletBalance(mainWalletId);
  const { data: cardBalance } = useWalletBalance(cardWalletId);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className={`p-6 space-y-6 h-screen overflow-y-auto shadow-lg rounded-xl  
      ${darkMode ? "dark:bg-gray-800" : "bg-gray-800"}
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Wallet Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BalanceCard label="Main Wallet" balance={mainBalance?.balance} />
        <BalanceCard label="Card Wallet" balance={cardBalance?.balance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DepositForm />
        <WithdrawForm balance={mainBalance?.balance ?? 0} />
        <TransferForm balance={mainBalance?.balance ?? 0} />
      </div>

      <TransactionHistory />
    </div>
  );
}
