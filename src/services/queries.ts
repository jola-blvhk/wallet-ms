import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import QUERYKEYS from "@/lib/queryKeys";
import endpoints from "@/lib/endpoints";

export const useWalletBalance = (balanceId: string | null) => {
  return useQuery({
    queryKey: QUERYKEYS.getWalletBalance(balanceId),
    queryFn: async () => {
      const { data } = await api.get(endpoints.getWalletBalance(balanceId));
      return data;
    },
    enabled: !!balanceId,
  });
};
