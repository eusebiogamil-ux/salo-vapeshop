import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useDeleteProduct } from "../../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../api/products";

interface Props { products: Product[]; onLogSale: (product: Product) => void; }

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e3e8ef",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

export function ProductTable({ products, onLogSale }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const del = useDeleteProduct();

  return (
    <>
      <div style={card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                {["Brand", "Name", "Flavor", "Nic", "Size", "Price", "Cost", "Stock", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm" style={{ color: "#a3acb9" }}>No products yet. Add your first product.</td></tr>
              )}
              {products.map((p, i) => (
                <tr key={p.id} className="hover:bg-[#f6f9fc] transition-colors" style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#1a1f36" }}>{p.brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#697386" }}>{p.name}</td>
                  <td className="px-4 py-3" style={{ color: "#a3acb9" }}>{p.flavor ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#a3acb9" }}>{p.nicotine_strength ?? "—"}</td>
                  <td className="px-4 py-3" style={{ color: "#a3acb9" }}>{p.size ?? "—"}</td>
                  <td className="px-4 py-3 font-medium tabular-nums" style={{ color: "#1a1f36" }}>₱{Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#a3acb9" }}>₱{Number(p.cost_price).toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-semibold ${p.is_low_stock ? "text-red-600" : ""}`} style={p.is_low_stock ? {} : { color: "#1a1f36" }}>{p.stock_quantity}</span>
                    {p.is_low_stock && <Badge variant="red" className="ml-2">Low</Badge>}
                  </td>
                  <td className="px-4 py-3">
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
