import client from "./client";

export interface DashboardStats {
  total_skus: number;
  total_stock_value: number;
  today_revenue: number;
  low_stock_count: number;
}

export interface InventoryRow {
  id: number;
  name: string;
  brand: string;
  flavor: string;
  nicotine_strength: string;
  size: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  stock_value: number;
  cost_value: number;
  margin_pct: number;
}

export interface SalesHistoryRow {
  product_id: number;
  product_name: string;
  product_brand: string;
  units_sold: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  margin_pct: number;
}

export const fetchDashboardStats = () =>
  client.get<DashboardStats>("/api/reports/dashboard-stats").then((r) => r.data);

export const fetchInventorySummary = () =>
  client.get<InventoryRow[]>("/api/reports/inventory-summary").then((r) => r.data);

export const fetchSalesHistory = (params?: { from_date?: string; to_date?: string }) =>
  client.get<SalesHistoryRow[]>("/api/reports/sales-history", { params }).then((r) => r.data);

export const inventoryCsvUrl = () =>
  `${client.defaults.baseURL}/api/reports/inventory-summary/csv`;

export const salesHistoryCsvUrl = (params?: { from_date?: string; to_date?: string }) => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return `${client.defaults.baseURL}/api/reports/sales-history/csv${qs ? `?${qs}` : ""}`;
};
