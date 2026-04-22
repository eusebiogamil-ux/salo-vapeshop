import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useDeleteProduct } from "../../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../api/products";

interface Props {
  products: Product[];
  onLogSale: (product: Product) => void;
}

export function ProductTable({ products, onLogSale }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const del = useDeleteProduct();

  const handleDelete = (p: Product) => {
    if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      del.mutate(p.id);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Brand", "Name", "Flavor", "Nic", "Size", "Price", "Cost", "Stock", ""].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-400">No products yet. Add your first product above.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{p.brand}</td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{p.name}</td>
                <td className="px-3 py-2 text-gray-500">{p.flavor ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.nicotine_strength ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{p.size ?? "—"}</td>
                <td className="px-3 py-2 text-gray-700">₱{Number(p.price).toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-500">₱{Number(p.cost_price).toFixed(2)}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="mr-1.5">{p.stock_quantity}</span>
                  {p.is_low_stock && <Badge variant="red">Low</Badge>}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => onLogSale(p)}>Sale</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p)}>Del</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductForm open={!!editing} onClose={() => setEditing(null)} product={editing} />
    </>
  );
}
