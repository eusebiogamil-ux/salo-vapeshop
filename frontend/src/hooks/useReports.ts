import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchInventorySummary, fetchSalesHistory, fetchMonthlyPl } from "../api/reports";

export function useDashboardStats(params?: { from_date?: string; to_date?: string }) {
  return useQuery({
    queryKey: ["dashboard-stats", params],
    queryFn: () => fetchDashboardStats(params),
    refetchInterval: 60_000,
  });
}

export function useInventorySummary() {
  return useQuery({ queryKey: ["inventory-summary"], queryFn: fetchInventorySummary });
}

export function useSalesHistory(params?: { from_date?: string; to_date?: string }) {
  return useQuery({ queryKey: ["sales-history", params], queryFn: () => fetchSalesHistory(params) });
}

export function useMonthlyPl() {
  return useQuery({ queryKey: ["monthly-pl"], queryFn: fetchMonthlyPl });
}
