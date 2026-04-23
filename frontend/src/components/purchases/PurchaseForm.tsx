import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { useCreatePurchase, useUpdatePurchase } from "../../hooks/usePurchases";
import { useProducts } from "../../hooks/useProducts";
import type { Purchase, PurchaseCreate } from "../../api/purchases";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pass an existing purchase to open in edit mode */
  purchase?: Purchase | null;
}

export function PurchaseForm({ open, onClose, purchase }: Props) {
  const { data: products = [] } = useProducts();
  const create = useCreatePurchase();
  const update = useUpdatePurchase();
  const isEdit = !!purchase;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseCreate & { _product_id_str: string }>();

  useEffect(() => {
    if (open) {
      reset(
        purchase
          ? {
              _product_id_str: purchase.product_id ? String(purchase.product_id) : "",
              quantity: purchase.quantity,
              unit_cost: purchase.unit_cost,
              shipping_fee: purchase.shipping_fee,
              notes: purchase.notes ?? undefined,
            }
          : { _product_id_str: "", quantity: undefined as any, unit_cost: undefined as any, shipping_fee: undefined as any, notes: undefined, add_to_stock: true }
      );
    }
  }, [open, purchase, reset]);

  const selectedId = Number(watch("_product_id_str"));
  const selected = products.find((p) => p.id === selectedId);
  const addToStock = watch("add_to_stock");
  const qty = Number(watch("quantity")) || 0;
  const unitCost = Number(watch("unit_cost")) || 0;
  const shipping = Number(watch("shipping_fee")) || 0;
  const total = qty * unitCost + shipping;

  const onSubmit = async (data: any) => {
    if (isEdit && purchase) {
      await update.mutateAsync({
        id: purchase.id,
        quantity: Number(data.quantity),
        unit_cost: Number(data.unit_cost),
        shipping_fee: Number(data.shipping_fee) || 0,
        notes: data.notes || undefined,
      });
    } else {
      await create.mutateAsync({
        product_id: data._product_id_str ? Number(data._product_id_str) : undefined,
        quantity: Number(data.quantity),
        unit_cost: Number(data.unit_cost),
        shipping_fee: Number(data.shipping_fee) || 0,
        notes: data.notes || undefined,
        add_to_stock: data.add_to_stock !== false,
      });
    }
    reset();
    onClose();
  };

  const isPending = create.isPending || update.isPending;
  const error = create.error || update.error;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Purchase" : "Record Purchase"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Product selector — disabled in edit mode (stock already applied) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Product <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          {isEdit ? (
            <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded px-3 py-2">
              {purchase?.product_brand ? `${purchase.product_brand} — ${purchase.product_name}` : "General / Other expense"}
              <span className="text-xs text-gray-400 ml-2">(cannot change product on edit)</span>
            </p>
          ) : (
            <select
              {...register("_product_id_str")}
              className="block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">— General / Other expense —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>
              ))}
            </select>
          )}
          {selected && !isEdit && (
            <div className="mt-1 p-3 rounded border border-gray-200 bg-gray-50 space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="add_to_stock" defaultChecked
                  {...register("add_to_stock")}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                <label htmlFor="add_to_stock" className="text-sm text-gray-700 cursor-pointer select-none font-medium">
                  Add quantity to stock
                </label>
              </div>
              <p className="text-xs text-gray-400 leading-snug">
                {addToStock === false
                  ? "Stock count will NOT change — use this if the product was already added to inventory when you created it."
                  : "Stock will increase by the quantity you enter below."}
              </p>
            </div>
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
          <div className="rounded-lg p-3 bg-gray-50 border border-gray-200">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Items ({qty} × ₱{unitCost.toFixed(2)})</span>
              <span>₱{(qty * unitCost).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            {shipping > 0 && (
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Shipping</span>
                <span>₱{shipping.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-gray-200 pt-1 mt-1">
              <span>Total</span>
              <span>₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        {isEdit && (
          <p className="text-xs text-gray-400">
            Stock will be adjusted by the quantity difference automatically.
          </p>
        )}

        <Input label="Notes" placeholder="e.g. Restocked Black Pod 5%" {...register("notes")} />

        {error && <p className="text-sm text-red-600">{(error as any).response?.data?.detail ?? "An error occurred"}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>{isEdit ? "Save Changes" : "Save Purchase"}</Button>
        </div>
      </form>
    </Modal>
  );
}
