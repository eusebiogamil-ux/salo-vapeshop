import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useCreateBulkPurchase } from "../../hooks/usePurchases";
import { useProducts } from "../../hooks/useProducts";

interface LineItem {
  product_id_str: string;
  quantity: string;
  unit_cost: string;
}

interface FormValues {
  items: LineItem[];
  shipping_fee: string;
  order_notes: string;
}

function php(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props { open: boolean; onClose: () => void; }

export function BulkPurchaseForm({ open, onClose }: Props) {
  const { data: products = [] } = useProducts();
  const create = useCreateBulkPurchase();

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { items: [{ product_id_str: "", quantity: "", unit_cost: "" }], shipping_fee: "", order_notes: "" },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (open) reset({ items: [{ product_id_str: "", quantity: "", unit_cost: "" }], shipping_fee: "", order_notes: "" });
  }, [open, reset]);

  const watchedItems    = watch("items");
  const watchedShipping = Number(watch("shipping_fee")) || 0;

  const subtotals     = watchedItems.map(r => (Number(r.quantity) || 0) * (Number(r.unit_cost) || 0));
  const totalSubtotal = subtotals.reduce((s, v) => s + v, 0);
  const grandTotal    = totalSubtotal + watchedShipping;

  // Per-item shipping split (proportional)
  const itemShipping = subtotals.map(sub =>
    totalSubtotal > 0 ? (sub / totalSubtotal) * watchedShipping : 0
  );

  const onSubmit = async (data: FormValues) => {
    const items = data.items
      .filter(r => Number(r.quantity) > 0 && Number(r.unit_cost) >= 0)
      .map(r => ({
        product_id: r.product_id_str ? Number(r.product_id_str) : undefined,
        quantity: Number(r.quantity),
        unit_cost: Number(r.unit_cost),
      }));

    if (items.length === 0) return;

    await create.mutateAsync({
      items,
      shipping_fee: Number(data.shipping_fee) || 0,
      order_notes: data.order_notes || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Purchase Order" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Line items */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 mb-1">
            <p className="col-span-5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#a3acb9" }}>Product</p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#a3acb9" }}>Qty</p>
            <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#a3acb9" }}>Unit Cost</p>
            <p className="col-span-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#a3acb9" }}>Subtotal</p>
          </div>

          {fields.map((field, i) => {
            const sub = subtotals[i] ?? 0;
            return (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                {/* Product */}
                <div className="col-span-5">
                  <select
                    {...register(`items.${i}.product_id_str`)}
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] transition-all"
                    style={{ border: "1px solid #e3e8ef", color: "#1a1f36", background: "#fff" }}
                  >
                    <option value="">— Other / General —</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Qty */}
                <div className="col-span-2">
                  <input
                    type="number" min="1" placeholder="0"
                    {...register(`items.${i}.quantity`, { required: true, min: 1 })}
                    className="w-full rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 transition-all"
                    style={{ border: `1px solid ${errors.items?.[i]?.quantity ? "#fca5a5" : "#e3e8ef"}`, color: "#1a1f36" }}
                  />
                </div>

                {/* Unit Cost */}
                <div className="col-span-3">
                  <input
                    type="number" min="0" step="0.01" placeholder="0.00"
                    {...register(`items.${i}.unit_cost`, { required: true, min: 0 })}
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 transition-all"
                    style={{ border: `1px solid ${errors.items?.[i]?.unit_cost ? "#fca5a5" : "#e3e8ef"}`, color: "#1a1f36" }}
                  />
                </div>

                {/* Subtotal + remove */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <span className="text-sm font-semibold tabular-nums" style={{ color: sub > 0 ? "#1a1f36" : "#c2c8d0" }}>
                    {sub > 0 ? php(sub) : "—"}
                  </span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)}
                      className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors hover:bg-red-50 hover:text-red-400"
                      style={{ color: "#c2c8d0" }}>✕</button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => append({ product_id_str: "", quantity: "", unit_cost: "" })}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors hover:bg-[#f0f3f7] mt-1"
            style={{ color: "#635bff", border: "1px dashed #c7c4ff" }}
          >
            + Add Item
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #f0f3f6" }} />

        {/* Shipping + Notes */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Shipping Fee (₱)"
            type="number" min="0" step="0.01" placeholder="0.00"
            {...register("shipping_fee")}
          />
          <Input
            label="Order Notes"
            placeholder="e.g. Shopee May batch"
            {...register("order_notes")}
          />
        </div>

        {/* Shipping split preview */}
        {watchedShipping > 0 && totalSubtotal > 0 && (
          <div className="rounded-xl p-3 space-y-1" style={{ background: "#f6f9fc", border: "1px solid #e3e8ef" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#a3acb9" }}>Shipping Split</p>
            {fields.map((field, i) => {
              const pid = watchedItems[i]?.product_id_str;
              const prod = products.find(p => p.id === Number(pid));
              const label = prod ? `${prod.brand} — ${prod.name}` : `Item ${i + 1}`;
              const share = itemShipping[i] ?? 0;
              if (!subtotals[i]) return null;
              return (
                <div key={field.id} className="flex justify-between text-xs" style={{ color: "#697386" }}>
                  <span className="truncate mr-4">{label}</span>
                  <span className="tabular-nums shrink-0">{php(share)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Order total */}
        {grandTotal > 0 && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: "#0a2540" }}>
            <div className="flex justify-between text-sm" style={{ color: "#7b9eb5" }}>
              <span>Items Subtotal</span>
              <span className="tabular-nums">{php(totalSubtotal)}</span>
            </div>
            {watchedShipping > 0 && (
              <div className="flex justify-between text-sm" style={{ color: "#7b9eb5" }}>
                <span>Shipping Fee</span>
                <span className="tabular-nums">{php(watchedShipping)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-base pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <span>Grand Total</span>
              <span className="tabular-nums">{php(grandTotal)}</span>
            </div>
            <p className="text-[10px]" style={{ color: "#4a7fa5" }}>
              Stock will be updated automatically for all products.
            </p>
          </div>
        )}

        {create.error && (
          <p className="text-sm text-red-500">{(create.error as any).response?.data?.detail ?? "An error occurred"}</p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Save Purchase Order</Button>
        </div>
      </form>
    </Modal>
  );
}
