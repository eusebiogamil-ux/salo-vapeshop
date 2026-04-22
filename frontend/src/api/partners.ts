import client from "./client";

export interface Partner {
  id: number;
  name: string;
  capital: number;
  units_sold: number;
  total_revenue: number;
  total_profit: number;
}

export const fetchPartners = () =>
  client.get<Partner[]>("/api/partners").then((r) => r.data);

export const updateCapital = (id: number, capital: number) =>
  client.patch(`/api/partners/${id}/capital`, { capital }).then((r) => r.data);
