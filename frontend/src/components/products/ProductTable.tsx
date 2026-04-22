import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useDeleteProduct } from "../../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../api/products";

interface Props { products: Product[]; onLogSale: (product: Product) => void; }

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#475569" }}>{children}</th>
);

export function ProductTable({ products, onLogSale }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const del = useDeleteProduct();

  return (
    <>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1e293b" }}>
        <table className="min-w-full divide-y text-sm" style={{ borderColor: "#1e293b" }}>
          <thead style={{ background: "#0d1424" }}>
            <tr>
              <TH>Brand</TH><TH>Name</TH><TH>Flavor</TH><TH>Nic</TH><TH>Size</TH>
              <TH>Price</TH><TH>Cost</TH><TH>Stock</TH><TH></TH>
            </tr>
          </thead>
          <tbody style={{ background: "#0a0e1a" }}>
            {products.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-600 text-base">No products yet. Add your first product!</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: "#1a2234" }}>
                <td className="px-4 py-3 font-bold text-slate-200 whitespace-nowrap">{p.brand}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 text-slate-500">{p.flavor ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.nicotine_strength ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500">{p.size ?? "—"}</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">₱{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-500">₱{Number(p.cost_price).toFixed(2)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`font-bold mr-2 ${p.is_low_stock ? "text-red-400" : "text-slate-300"}`}>{p.stock_quantity}</span>
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
      <ProductForm open={!!editing} onClose={() => setEditing(null)} product={editing} />
    </>
  );
}
