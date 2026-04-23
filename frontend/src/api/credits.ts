import client from "./client";

export interface Credit {
  id: number;
  customer_name: string;
  amount: number;
  amount_paid: number;
  balance: number;
  description: string | null;
  due_date: string | null;
  is_settled: boolean;
  created_at: string;
}

export interface CreditCreate {
  customer_name: string;
  amount: number;
  description?: string;
  due_date?: string;
}

export const fetchCredits = (settled?: boolean) =>
  client.get<Credit[]>("/api/credits", { params: settled !== undefined ? { settled } : {} }).then(r => r.data);

export const createCredit = (data: CreditCreate) =>
  client.post<Credit>("/api/credits", data).then(r => r.data);

export const recordPayment = (id: number, amount_paid: number) =>
  client.patch<Credit>(`/api/credits/${id}/pay`, { amount_paid }).then(r => r.data);

export const settleCredit = (id: number) =>
  client.patch<Credit>(`/api/credits/${id}/settle`).then(r => r.data);

export const deleteCredit = (id: number) =>
  client.delete(`/api/credits/${id}`);
