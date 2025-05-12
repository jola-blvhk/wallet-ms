"use client";

import BalanceCard from "./BalanceCard";
import DepositForm from "./Deposit/DepositForm";
import WithdrawForm from "./Withdrawal/WithdrawForm";
import TransferForm from "./TransferToCard/TransferForm";
import TransactionHistory from "./TransactionHistory";
import { useWalletBalance } from "@/services/queries";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function WalletDashboard() {
  const { mainWalletId, cardWalletId, firstName, lastName, logout } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: mainBalance } = useWalletBalance(mainWalletId);
  const { data: cardBalance } = useWalletBalance(cardWalletId);

  // Handle theme toggle
  // const toggleTheme = () => {
  //   console.log("Current theme:", theme);
  //   const newTheme = theme === "dark" ? "light" : "dark";
  //   console.log("Setting theme to:", newTheme);
  //   setTheme(newTheme);
  // };

  if (!mounted)
    return <div className="h-screen bg-gray-50 dark:bg-gray-800"></div>;

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto shadow-lg rounded-xl bg-gray-50 dark:bg-gray-800">
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-700 
        border-l-4 border-blue-400 dark:border-purple-400 p-4 sm:p-6 rounded-xl shadow-md mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-purple-400 dark:bg-opacity-25 p-2 rounded-full">
              <UserIcon className="h-8 w-8 text-blue-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Welcome back,
              </p>
              <h2 className="text-gray-800 dark:text-gray-200 text-xl sm:text-2xl font-bold">
                {firstName} {lastName}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                text-gray-700 dark:text-gray-300"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button> */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg flex items-center transition-colors
                bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <span className="mr-2 hidden sm:inline">Logout</span>
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
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
