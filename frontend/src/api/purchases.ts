import client from "./client";

export interface Purchase {
  id: number;
  product_id: number | null;
  product_name: string | null;
  product_brand: string | null;
  quantity: number;
  unit_cost: number;
  shipping_fee: number;
  total_cost: number;
  notes: string | null;
  purchased_at: string;
}

export interface PurchaseCreate {
  product_id?: number;
  quantity: number;
  unit_cost: number;
  shipping_fee?: number;
  notes?: string;
  add_to_stock?: boolean;
}

export interface PurchaseUpdate {
  quantity: number;
  unit_cost: number;
  shipping_fee?: number;
  notes?: string;
}

export interface BulkPurchaseItem {
  product_id?: number;
  quantity: number;
  unit_cost: number;
  notes?: string;
}

export interface BulkPurchaseCreate {
  items: BulkPurchaseItem[];
  shipping_fee?: number;
  order_notes?: string;
}

export const fetchPurchases = () =>
  client.get<Purchase[]>("/api/purchases").then((r) => r.data);

export const createPurchase = (data: PurchaseCreate) =>
  client.post<Purchase>("/api/purchases", data).then((r) => r.data);

export const createBulkPurchase = (data: BulkPurchaseCreate) =>
  client.post("/api/purchases/bulk", data).then((r) => r.data);

export const updatePurchase = ({ id, ...data }: PurchaseUpdate & { id: number }) =>
  client.patch<Purchase>(`/api/purchases/${id}`, data).then((r) => r.data);

export const voidPurchase = (id: number) =>
  client.delete(`/api/purchases/${id}`);
