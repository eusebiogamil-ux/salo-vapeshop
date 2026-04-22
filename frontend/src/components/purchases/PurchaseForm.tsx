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

  const onSubmit = async (data: any) => {
    await create.mutateAsync({
      product_id: data._product_id_str ? Number(data._product_id_str) : undefined,
      quantity: Number(data.quantity),
      unit_cost: Number(data.unit_cost),
      notes: data.notes || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Purchase">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Product <span className="text-gray-400 font-normal">(optional)</span></label>
          <select
            {...register("_product_id_str")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">— General / Other expense —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>
            ))}
          </select>
          {selected && (
            <p className="text-xs text-indigo-600 mt-0.5">Stock will be added automatically when saved</p>
          )}
        </div>

        <Input
          label="Quantity *"
          type="number"
          min="1"
          {...register("quantity", { required: "Required", min: { value: 1, message: "At least 1" } })}
          error={errors.quantity?.message}
        />

        <Input
          label="Unit Cost (₱) *"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 250.00"
          {...register("unit_cost", { required: "Required", min: { value: 0, message: "Must be positive" } })}
          error={errors.unit_cost?.message}
        />

        {watch("quantity") && watch("unit_cost") && (
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <p className="text-sm text-indigo-700 font-semibold">
              Total cost: ₱{(Number(watch("quantity")) * Number(watch("unit_cost"))).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
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
