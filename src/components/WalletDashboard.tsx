"use client";

import { useState } from "react";
import BalanceCard from "./BalanceCard";
import DepositForm from "./Deposit/DepositForm";
import WithdrawForm from "./Withdrawal/WithdrawForm";
import TransferForm from "./TransferToCard/TransferForm";
import TransactionHistory from "./TransactionHistory";
import { useWalletBalance } from "@/services/queries";

export default function WalletDashboard() {
  const mainBalanceId = "bln_cd182069-a1a6-4305-b2e8-d1949da22bdb";
  const cardBalanceId = "bln_5a409804-08eb-43c9-bb7b-3d56a1c50f8e";
  const { data: mainBalance } = useWalletBalance(mainBalanceId);
  const { data: cardBalance } = useWalletBalance(cardBalanceId);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  console.log(toggleDarkMode);
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
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">
          Create Identity
        </button>
      </div>

      {/* Dark Mode Toggle */}
      {/* <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-2">
          <SunIcon className="h-6 w-6 text-yellow-500" />
          <Switch checked={darkMode} onChange={toggleDarkMode} />
          <MoonIcon className="h-6 w-6 text-blue-600" />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BalanceCard label="Main Wallet" balance={mainBalance?.balance} />
        <BalanceCard label="Card Wallet" balance={cardBalance?.balance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DepositForm />
        <WithdrawForm balance={mainBalance?.balance ?? 0} />
        <TransferForm balance={mainBalance?.balance ?? 0} />
      </div>

      <TransactionHistory />
    </div>
  );
}
