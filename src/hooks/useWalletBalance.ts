import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useMainWalletBalance = (userId: string) => {
  return useQuery({
    queryKey: ["get-balance", userId],
    queryFn: async () => {
      const { data } = await api.get(`/balances/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};
