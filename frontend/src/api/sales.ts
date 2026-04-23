import client from "./client";

export interface Sale {
  id: number;
  product_id: number;
  quantity_sold: number;
  unit_price: number;
  unit_cost: number;
  total_revenue: number;
  total_cost: number;
  partner_id: number | null;
  cash_collected: boolean;
  notes: string | null;
  sold_at: string;
  created_at: string;
  product_name: string | null;
  product_brand: string | null;
  partner_name: string | null;
}

export interface SaleCreate {
  product_id: number;
  quantity_sold: number;
  partner_id?: number;
  cash_collected?: boolean;
  notes?: string;
}

export const fetchSales = (params?: { product_id?: number; from_date?: string; to_date?: string; cash_collected?: boolean; skip?: number; limit?: number }) =>
  client.get<Sale[]>("/api/sales", { params }).then((r) => r.data);

export const createSale = (data: SaleCreate) =>
  client.post<Sale>("/api/sales", data).then((r) => r.data);

export const markCollected = (id: number) =>
  client.patch<Sale>(`/api/sales/${id}/collect`).then((r) => r.data);

export const voidSale = (id: number) =>
  client.delete(`/api/sales/${id}`);
