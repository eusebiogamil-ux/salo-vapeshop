import client from "./client";

export interface DashboardStats {
  // Inventory
  total_skus: number;
  total_stock_value: number;
  total_inventory_cost: number;
  low_stock_count: number;
  // Capital & cash (always all-time)
  total_capital: number;
  total_spent: number;
  cash_on_hand: number;
  // Receivables
  total_receivable: number;
  unpaid_count: number;
  // Today snapshot
  today_revenue: number;
  today_units: number;
  today_gross_profit: number;
  // All-time P&L (for balance sheet)
  atl_revenue: number;
  atl_cost: number;
  atl_gross_profit: number;
  atl_units: number;
  // Period P&L (filtered or all-time when no filter)
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  total_units: number;
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

export interface MonthlyPlRow {
  year: number;
  month: number;
  label: string;
  units: number;
  revenue: number;
  cogs: number;
  gross_profit: number;
}

export const fetchDashboardStats = (params?: { from_date?: string; to_date?: string }) =>
  client.get<DashboardStats>("/api/reports/dashboard-stats", { params }).then((r) => r.data);

export const fetchInventorySummary = () =>
  client.get<InventoryRow[]>("/api/reports/inventory-summary").then((r) => r.data);

export const fetchSalesHistory = (params?: { from_date?: string; to_date?: string }) =>
  client.get<SalesHistoryRow[]>("/api/reports/sales-history", { params }).then((r) => r.data);

export const fetchMonthlyPl = () =>
  client.get<MonthlyPlRow[]>("/api/reports/monthly-pl").then((r) => r.data);

export const inventoryCsvUrl = () =>
  `${client.defaults.baseURL}/api/reports/inventory-summary/csv`;

export const salesHistoryCsvUrl = (params?: { from_date?: string; to_date?: string }) => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return `${client.defaults.baseURL}/api/reports/sales-history/csv${qs ? `?${qs}` : ""}`;
};
