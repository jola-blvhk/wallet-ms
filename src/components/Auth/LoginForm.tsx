/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import {
  IdentificationIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { getCurrencyByCountry } from "@/lib/currencyUtils";

export default function LoginForm({
  onToggleForm,
}: {
  onToggleForm: () => void;
}) {
  const [identityId, setIdentityId] = useState("");
  const [mainWalletId, setMainWalletId] = useState("");
  const [cardWalletId, setCardWalletId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();

  // Fetch user data mutation
  const fetchUserMutation = useMutation({
    mutationFn: (id: string) => api.get(`/identities/${id}`),
    onSuccess: (response) => {
      console.log(response.data)
      const userData = response.data;
      completeLogin(userData);
    },
    onError: (error) => {
      console.error("Failed to fetch user data:", error);
      toast.error("Identity ID not found. Please check your credentials.");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identityId || !mainWalletId || !cardWalletId) {
      toast.error("Please enter all required IDs");
      return;
    }

    setIsLoading(true);

    try {
      const [mainWalletResponse, cardWalletResponse] = await Promise.all([
        api.get(`/balances/${mainWalletId}`),
        api.get(`/balances/${cardWalletId}`),
      ]);

      if (!mainWalletResponse.data || !cardWalletResponse.data) {
        toast.error("One or more wallet IDs are invalid");
        setIsLoading(false);
        return;
      }

      // Verify that the wallets belong to the same identity
      const mainWalletIdentityId = mainWalletResponse.data.identity_id;
      const cardWalletIdentityId = cardWalletResponse.data.identity_id;

      // Validate that both wallets belong to the entered identity
      if (mainWalletIdentityId !== identityId || cardWalletIdentityId !== identityId) {
        toast.error("The wallet IDs do not belong to this identity");
        setIsLoading(false);
        return;
      }

      // Now fetch the identity details
      fetchUserMutation.mutate(identityId);
    } catch (error) {
      console.error("Login validation failed:", error);
      toast.error("Invalid wallet IDs. Please check your credentials.");
      setIsLoading(false);
    }
  };
  const completeLogin = (userData: any) => {
    const country = userData.country || "US";
    const currencyInfo = getCurrencyByCountry(country);
    
    setUser({
      identityId,
      firstName: userData.first_name || "User",
      lastName: userData.last_name || "",
      mainWalletId,
      cardWalletId,
      country,
      currencyCode: currencyInfo.currencyCode,
      currencySymbol: currencyInfo.currencySymbol,
      currencyPrecision: currencyInfo.precision,
    });

    toast.success("Login successful!");
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md  mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center dark:text-white">
        Login to Your Wallet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white  items-center">
            <IdentificationIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            Identity ID
          </label>
          <input
            type="text"
            value={identityId}
            onChange={(e) => setIdentityId(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="idt_xxxxxxxx-xxxx-xxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white flex items-center">
            <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            Main Wallet ID
          </label>
          <input
            type="text"
            value={mainWalletId}
            onChange={(e) => setMainWalletId(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="bln_xxxxxxxx-xxxx-xxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white flex items-center">
            <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            Card Wallet ID
          </label>
          <input
            type="text"
            value={cardWalletId}
            onChange={(e) => setCardWalletId(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="bln_xxxxxxxx-xxxx-xxxx"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging In...
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={onToggleForm}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}