import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchInventorySummary, fetchSalesHistory } from "../api/reports";

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard-stats"], queryFn: fetchDashboardStats, refetchInterval: 60_000 });
}

export function useInventorySummary() {
  return useQuery({ queryKey: ["inventory-summary"], queryFn: fetchInventorySummary });
}

export function useSalesHistory(params?: { from_date?: string; to_date?: string }) {
  return useQuery({ queryKey: ["sales-history", params], queryFn: () => fetchSalesHistory(params) });
}
