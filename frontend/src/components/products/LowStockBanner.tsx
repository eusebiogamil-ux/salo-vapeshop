import type { Product } from "../../api/products";

export function LowStockBanner({ products }: { products: Product[] }) {
  const low = products.filter((p) => p.is_low_stock);
  if (low.length === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
      <p className="font-semibold text-red-700 mb-1">{low.length} item{low.length > 1 ? "s" : ""} running low:</p>
      <ul className="text-red-600 space-y-0.5 list-disc list-inside">
        {low.map((p) => (
          <li key={p.id}>{p.brand} — {p.name}: {p.stock_quantity} left (min {p.low_stock_threshold})</li>
        ))}
      </ul>
    </div>
  );
}
