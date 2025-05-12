const QUERYKEYS = {
  // Query keys for fetching data
  getWalletBalance: (balanceId: string | null) => [
    "get-wallet-balance",
    balanceId,
  ],
  getWalletTransactions: (walletId: string) => [
    "get-wallet-transactions",
    walletId,
  ],
};

export default QUERYKEYS;
