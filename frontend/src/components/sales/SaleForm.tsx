import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { useCreateSale } from "../../hooks/useSales";
import { useProducts } from "../../hooks/useProducts";
import { usePartners } from "../../hooks/usePartners";
import type { SaleCreate } from "../../api/sales";
import type { Product } from "../../api/products";

interface Props { open: boolean; onClose: () => void; product?: Product | null; }

export function SaleForm({ open, onClose, product: preProduct }: Props) {
  const { data: products = [] } = useProducts();
  const { data: partners = [] } = usePartners();
  const create = useCreateSale();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SaleCreate & { _product_id_str: string; _partner_id_str: string }>();

  useEffect(() => {
    if (open) reset({ _product_id_str: String(preProduct?.id ?? ""), quantity_sold: 1 });
  }, [open, preProduct, reset]);

  const selectedId = Number(watch("_product_id_str"));
  const selected = products.find((p) => p.id === selectedId) ?? preProduct;

  const onSubmit = async (data: any) => {
    await create.mutateAsync({
      product_id: Number(data._product_id_str),
      quantity_sold: Number(data.quantity_sold),
      partner_id: data._partner_id_str ? Number(data._partner_id_str) : undefined,
      notes: data.notes,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Sale">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Product *</label>
          <select
            {...register("_product_id_str", { required: "Required" })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} — {p.name} (stock: {p.stock_quantity})</option>
            ))}
          </select>
          {errors._product_id_str && <p className="text-xs text-red-600">{errors._product_id_str.message}</p>}
        </div>

        {selected && (
          <div className="rounded-lg p-3 bg-slate-50 border border-slate-200 text-sm space-y-0.5">
            <p className="text-slate-600">Price: <strong className="text-emerald-700">₱{Number(selected.price).toFixed(2)}</strong></p>
            <p className="text-slate-600">Stock: <strong className={selected.is_low_stock ? "text-red-600" : "text-slate-800"}>{selected.stock_quantity}</strong></p>
          </div>
        )}

        <Input label="Quantity *" type="number" min="1" max={selected?.stock_quantity}
          {...register("quantity_sold", { required: "Required", min: { value: 1, message: "Must be at least 1" } })}
          error={errors.quantity_sold?.message} />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Recorded by *</label>
          <select
            {...register("_partner_id_str", { required: "Required" })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select partner…</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <Input label="Notes" placeholder="Optional" {...register("notes")} />

        {create.error && <p className="text-sm text-red-600">{(create.error as any).response?.data?.detail ?? "An error occurred"}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Record Sale</Button>
        </div>
      </form>
    </Modal>
  );
}
