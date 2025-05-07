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
  source: string;
  destination: string;
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
      // Invalidate the balance query to refetch updated balance
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.getWalletBalance(
          "bln_cd182069-a1a6-4305-b2e8-d1949da22bdb"
        ),
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
