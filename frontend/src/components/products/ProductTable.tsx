import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useDeleteProduct } from "../../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../api/products";

interface Props { products: Product[]; onLogSale: (product: Product) => void; }

const TH = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap bg-slate-50">{children}</th>
);

export function ProductTable({ products, onLogSale }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const del = useDeleteProduct();

  return (
    <>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <TH>Brand</TH><TH>Name</TH><TH>Flavor</TH><TH>Nic</TH><TH>Size</TH>
                <TH>Price</TH><TH>Cost</TH><TH>Stock</TH><TH></TH>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400">No products yet. Add your first product!</td></tr>
              )}
              {products.map((p, i) => (
                <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{p.brand}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.flavor ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.nicotine_strength ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{p.size ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">₱{Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">₱{Number(p.cost_price).toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-bold mr-2 ${p.is_low_stock ? "text-red-600" : "text-slate-800"}`}>{p.stock_quantity}</span>
                    {p.is_low_stock && <Badge variant="red">Low</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
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
