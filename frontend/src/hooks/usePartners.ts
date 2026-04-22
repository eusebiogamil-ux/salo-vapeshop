import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPartners, updateCapital } from "../api/partners";

export const PARTNERS_KEY = ["partners"] as const;

export function usePartners() {
  return useQuery({ queryKey: PARTNERS_KEY, queryFn: fetchPartners });
}

export function useUpdateCapital() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, capital }: { id: number; capital: number }) => updateCapital(id, capital),
    onSuccess: () => qc.invalidateQueries({ queryKey: PARTNERS_KEY }),
  });
}
