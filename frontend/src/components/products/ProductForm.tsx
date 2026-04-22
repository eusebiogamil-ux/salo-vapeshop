import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";
import type { Product, ProductCreate } from "../../api/products";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductForm({ open, onClose, product }: Props) {
  const isEdit = !!product;
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const pending = create.isPending || update.isPending;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductCreate>();

  useEffect(() => {
    if (open) {
      reset(product ?? { stock_quantity: 0, low_stock_threshold: 5 });
    }
  }, [open, product, reset]);

  const onSubmit = async (data: ProductCreate) => {
    const payload = {
      ...data,
      price: Number(data.price),
      cost_price: Number(data.cost_price),
      stock_quantity: Number(data.stock_quantity),
      low_stock_threshold: Number(data.low_stock_threshold),
    };
    if (isEdit) {
      await update.mutateAsync({ id: product!.id, data: payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const error = create.error || update.error;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Product" : "Add Product"} wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name *" {...register("name", { required: "Required" })} error={errors.name?.message} />
          <Input label="Brand *" {...register("brand", { required: "Required" })} error={errors.brand?.message} />
          <Input label="Flavor" {...register("flavor")} />
          <Input label="Nicotine Strength" placeholder="e.g. 3mg" {...register("nicotine_strength")} />
          <Input label="Size" placeholder="e.g. 60ml" {...register("size")} />
          <div />
          <Input label="Sell Price (₱) *" type="number" step="0.01" min="0" {...register("price", { required: "Required" })} error={errors.price?.message} />
          <Input label="Cost Price (₱) *" type="number" step="0.01" min="0" {...register("cost_price", { required: "Required" })} error={errors.cost_price?.message} />
          <Input label="Stock Quantity *" type="number" min="0" {...register("stock_quantity", { required: "Required" })} error={errors.stock_quantity?.message} />
          <Input label="Low Stock Threshold" type="number" min="0" {...register("low_stock_threshold")} />
        </div>
        {error && <p className="text-sm text-red-400">{(error as any).response?.data?.detail ?? "An error occurred"}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={pending}>{isEdit ? "Save Changes" : "Add Product"}</Button>
        </div>
      </form>
    </Modal>
  );
}
