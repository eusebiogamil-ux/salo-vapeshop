import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useDeleteProduct } from "../../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../api/products";

interface Props { products: Product[]; onLogSale: (product: Product) => void; }

export function ProductTable({ products, onLogSale }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const del = useDeleteProduct();

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Brand","Name","Flavor","Nic","Size","Price","Cost","Stock",""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No products yet. Add your first product.</td></tr>
              )}
              {products.map((p, i) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-800 whitespace-nowrap">{p.brand}</td>
                  <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-2.5 text-gray-400">{p.flavor ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{p.nicotine_strength ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-400">{p.size ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-800">₱{Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-gray-400">₱{Number(p.cost_price).toFixed(2)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-semibold ${p.is_low_stock ? "text-red-600" : "text-gray-700"}`}>{p.stock_quantity}</span>
                    {p.is_low_stock && <Badge variant="red" className="ml-1.5">Low</Badge>}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => onLogSale(p)}>Sale</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProductForm open={!!editing} onClose={() => setEditing(null)} product={editing} />
    </>
  );
}
