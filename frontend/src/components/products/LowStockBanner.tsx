import type { Product } from "../../api/products";

export function LowStockBanner({ products }: { products: Product[] }) {
  const low = products.filter((p) => p.is_low_stock);
  if (low.length === 0) return null;

  return (
    <div className="rounded-xl px-5 py-4 border" style={{ background: "#1a0f0f", borderColor: "#7f1d1d" }}>
      <p className="text-sm font-bold text-red-400 mb-2">⚠️ {low.length} product{low.length > 1 ? "s" : ""} running low on stock</p>
      <ul className="text-sm text-red-500/80 list-disc list-inside space-y-0.5">
        {low.map((p) => (
          <li key={p.id}>{p.brand} — {p.name}: <strong className="text-red-400">{p.stock_quantity}</strong> left (threshold: {p.low_stock_threshold})</li>
        ))}
      </ul>
    </div>
  );
}
