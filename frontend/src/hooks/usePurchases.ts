import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPurchases, createPurchase, voidPurchase } from "../api/purchases";

export const PURCHASES_KEY = ["purchases"] as const;

export function usePurchases() {
  return useQuery({ queryKey: PURCHASES_KEY, queryFn: fetchPurchases });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PURCHASES_KEY });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useVoidPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: voidPurchase,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PURCHASES_KEY });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
