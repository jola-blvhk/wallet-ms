import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import QUERYKEYS from "@/lib/queryKeys";

export type TransactionType = "deposit" | "withdraw" | "transfer";

interface TransactionPayload {
  amount: number;
  precision: number;
  reference: string;
  description: string;
  currency: string;
  source: string | null;
  destination: string | null;
  allow_overdraft: boolean;
  meta_data: {
    transaction_type: TransactionType;
    channel: string;
  };
}

export const useRecordTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransactionPayload) =>
      api.post("/transactions", payload),
    onSuccess: () => {
      // Invalidate  transactions query to refetch updated transactions

      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.getWalletTransactions("main"),
      });
    },
  });
};

interface SearchTransactionsPayload {
  q: string;
  query_by: string;
}

export const useSearchTransactions = () => {
  return useMutation({
    mutationFn: (payload: SearchTransactionsPayload) =>
      api.post("/search/transactions", payload),
  });
};
