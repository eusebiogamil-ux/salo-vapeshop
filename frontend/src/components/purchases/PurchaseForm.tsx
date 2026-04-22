import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { useCreatePurchase } from "../../hooks/usePurchases";
import { useProducts } from "../../hooks/useProducts";
import type { PurchaseCreate } from "../../api/purchases";

interface Props { open: boolean; onClose: () => void; }

export function PurchaseForm({ open, onClose }: Props) {
  const { data: products = [] } = useProducts();
  const create = useCreatePurchase();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseCreate & { _product_id_str: string }>();

  const selectedId = Number(watch("_product_id_str"));
  const selected = products.find((p) => p.id === selectedId);
  const qty = Number(watch("quantity")) || 0;
  const unitCost = Number(watch("unit_cost")) || 0;
  const shipping = Number(watch("shipping_fee")) || 0;
  const total = qty * unitCost + shipping;

  const onSubmit = async (data: any) => {
    await create.mutateAsync({
      product_id: data._product_id_str ? Number(data._product_id_str) : undefined,
      quantity: Number(data.quantity),
      unit_cost: Number(data.unit_cost),
      shipping_fee: Number(data.shipping_fee) || 0,
      notes: data.notes || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Purchase">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Product <span className="normal-case font-normal text-slate-400">(optional)</span>
          </label>
          <select
            {...register("_product_id_str")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">— General / Other expense —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>
            ))}
          </select>
          {selected && (
            <p className="text-xs text-indigo-600">Stock will be added automatically</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Quantity *" type="number" min="1"
            {...register("quantity", { required: "Required", min: { value: 1, message: "Min 1" } })}
            error={errors.quantity?.message} />

          <Input label="Unit Cost (₱) *" type="number" min="0" step="0.01" placeholder="0.00"
            {...register("unit_cost", { required: "Required", min: { value: 0, message: "Must be ≥ 0" } })}
            error={errors.unit_cost?.message} />
        </div>

        <Input label="Shipping Fee (₱)" type="number" min="0" step="0.01" placeholder="0.00"
          {...register("shipping_fee")} />

        {(qty > 0 && unitCost > 0) && (
          <div className="rounded-lg p-3 bg-amber-50 border border-amber-200">
            <div className="flex justify-between text-xs text-amber-700 mb-1">
              <span>Items ({qty} × ₱{unitCost.toFixed(2)})</span>
              <span>₱{(qty * unitCost).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            {shipping > 0 && (
              <div className="flex justify-between text-xs text-amber-700 mb-1">
                <span>Shipping</span>
                <span>₱{shipping.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-amber-800 border-t border-amber-200 pt-1 mt-1">
              <span>Total</span>
              <span>₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        <Input label="Notes" placeholder="e.g. Restocked Black Pod 5%" {...register("notes")} />

        {create.error && <p className="text-sm text-red-600">{(create.error as any).response?.data?.detail ?? "An error occurred"}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Save Purchase</Button>
        </div>
      </form>
    </Modal>
  );
}
