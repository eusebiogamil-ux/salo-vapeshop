import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, fetchSales, markCollected, voidSale, type SaleCreate } from "../api/sales";
import { PRODUCTS_KEY } from "./useProducts";

const SALES_KEY = ["sales"] as const;
export { SALES_KEY };

export function useSales(params?: { product_id?: number; from_date?: string; to_date?: string; cash_collected?: boolean }) {
  return useQuery({ queryKey: [...SALES_KEY, params], queryFn: () => fetchSales(params) });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SaleCreate) => createSale(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_KEY });
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useMarkCollected() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markCollected(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_KEY });
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useVoidSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => voidSale(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_KEY });
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
