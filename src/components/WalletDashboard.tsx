"use client";

import BalanceCard from "./BalanceCard";
import DepositForm from "./Deposit/DepositForm";
import WithdrawForm from "./Withdrawal/WithdrawForm";
import TransferForm from "./TransferToCard/TransferForm";
import TransactionHistory from "./TransactionHistory";
import { useWalletBalance } from "@/services/queries";
import { useUser } from "@/contexts/UserContext";
import { UserIcon } from "@heroicons/react/24/outline";

export default function WalletDashboard() {
  const { mainWalletId, cardWalletId, firstName, lastName } = useUser();

  const { data: mainBalance } = useWalletBalance(mainWalletId);
  const { data: cardBalance } = useWalletBalance(cardWalletId);

  return (
    <div
      className={`p-6 space-y-6 h-screen overflow-y-auto shadow-lg rounded-xl bg-gray-800`}
    >

      <div className="bg-gradient-to-r from-gray-900 to-gray-700 border-l-4 border-purple-400 p-4 sm:p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center">
          <div className="bg-purple-400 bg-opacity-25 p-2 rounded-full">
            <UserIcon className="h-8 w-8 text-purple-300" />
          </div>
          <div className="ml-4">
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h2 className="text-gray-200 text-xl sm:text-2xl font-bold">
              {firstName} {lastName}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-200">Wallet Dashboard</h1>
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
