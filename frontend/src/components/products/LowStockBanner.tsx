import type { Product } from "../../api/products";

export function LowStockBanner({ products }: { products: Product[] }) {
  const low = products.filter((p) => p.is_low_stock);
  if (low.length === 0) return null;
  return (
    <div className="px-4 py-3 text-sm rounded-xl" style={{ background: "#fff5f5", border: "1px solid #fed7d7" }}>
      <p className="font-semibold text-red-700 mb-1">{low.length} item{low.length > 1 ? "s" : ""} running low</p>
      <ul className="space-y-0.5 list-disc list-inside" style={{ color: "#c53030" }}>
        {low.map((p) => (
          <li key={p.id}>{p.brand} — {p.name}: {p.stock_quantity} left (min {p.low_stock_threshold})</li>
        ))}
      </ul>
    </div>
  );
}
