import client from "./client";

export interface Sale {
  id: number;
  product_id: number;
  quantity_sold: number;
  unit_price: number;
  unit_cost: number;
  total_revenue: number;
  total_cost: number;
  notes: string | null;
  sold_at: string;
  created_at: string;
  product_name: string | null;
  product_brand: string | null;
}

export interface SaleCreate {
  product_id: number;
  quantity_sold: number;
  partner_id?: number;
  notes?: string;
}

export const fetchSales = (params?: { product_id?: number; from_date?: string; to_date?: string; skip?: number; limit?: number }) =>
  client.get<Sale[]>("/api/sales", { params }).then((r) => r.data);

export const createSale = (data: SaleCreate) =>
  client.post<Sale>("/api/sales", data).then((r) => r.data);

export const voidSale = (id: number) =>
  client.delete(`/api/sales/${id}`);
