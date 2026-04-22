import client from "./client";

export interface Product {
  id: number;
  name: string;
  brand: string;
  flavor: string | null;
  nicotine_strength: string | null;
  size: string | null;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_low_stock: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductCreate = Omit<Product, "id" | "is_active" | "is_low_stock" | "created_at" | "updated_at">;
export type ProductUpdate = ProductCreate;

export const fetchProducts = (lowStock = false) =>
  client.get<Product[]>("/api/products", { params: lowStock ? { low_stock: true } : {} }).then((r) => r.data);

export const fetchProduct = (id: number) =>
  client.get<Product>(`/api/products/${id}`).then((r) => r.data);

export const createProduct = (data: ProductCreate) =>
  client.post<Product>("/api/products", data).then((r) => r.data);

export const updateProduct = (id: number, data: ProductUpdate) =>
  client.put<Product>(`/api/products/${id}`, data).then((r) => r.data);

export const adjustStock = (id: number, quantity: number) =>
  client.patch<Product>(`/api/products/${id}/stock`, { quantity }).then((r) => r.data);

export const deleteProduct = (id: number) =>
  client.delete(`/api/products/${id}`);
