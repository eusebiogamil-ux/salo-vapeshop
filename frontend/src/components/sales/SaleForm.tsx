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

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function SaleForm({ open, onClose, product: preProduct }: Props) {
  const { data: products = [] } = useProducts();
  const { data: partners = [] } = usePartners();
  const create = useCreateSale();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SaleCreate & { _product_id_str: string }>();

  useEffect(() => {
    if (open) reset({ product_id: preProduct?.id, _product_id_str: String(preProduct?.id ?? ""), quantity_sold: 1 });
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

  const error = create.error;

  return (
    <Modal open={open} onClose={onClose} title="Record Sale">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Product *</label>
          <select
            {...register("_product_id_str", { required: "Required" })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} — {p.name} (stock: {p.stock_quantity})</option>
            ))}
          </select>
          {errors._product_id_str && <p className="text-xs text-red-600">{errors._product_id_str.message}</p>}
        </div>

        {selected && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-0.5">
            <p>Sell price: <strong>₱{Number(selected.price).toFixed(2)}</strong></p>
            <p>Available stock: <strong className={selected.is_low_stock ? "text-red-600" : ""}>{selected.stock_quantity}</strong></p>
          </div>
        )}

        <Input
          label="Quantity *"
          type="number"
          min="1"
          max={selected?.stock_quantity}
          {...register("quantity_sold", { required: "Required", min: { value: 1, message: "Must be at least 1" } })}
          error={errors.quantity_sold?.message}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Recorded by *</label>
          <select
            {...register("_partner_id_str", { required: "Please select a partner" })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select partner…</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <Input label="Notes" placeholder="Optional" {...register("notes")} />

        {error && <p className="text-sm text-red-600">{(error as any).response?.data?.detail ?? "An error occurred"}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Record Sale</Button>
        </div>
      </form>
    </Modal>
  );
}
