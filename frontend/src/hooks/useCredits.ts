import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCredits, createCredit, recordPayment, settleCredit, deleteCredit } from "../api/credits";

const KEY = "credits";

export const useCredits = (settled?: boolean) =>
  useQuery({ queryKey: [KEY, settled], queryFn: () => fetchCredits(settled) });

export const useCreateCredit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCredit,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) => recordPayment(id, amount),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useSettleCredit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settleCredit,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteCredit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCredit,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};
