import type { Product } from "../../api/products";

export function LowStockBanner({ products }: { products: Product[] }) {
  const low = products.filter((p) => p.is_low_stock);
  if (low.length === 0) return null;

  return (
    <div className="rounded-xl px-4 py-3 bg-red-50 border border-red-200">
      <p className="text-sm font-bold text-red-700 mb-1.5">
        {low.length} product{low.length > 1 ? "s" : ""} running low
      </p>
      <ul className="text-sm text-red-600 list-disc list-inside space-y-0.5">
        {low.map((p) => (
          <li key={p.id}>{p.brand} — {p.name}: <strong>{p.stock_quantity}</strong> left (min {p.low_stock_threshold})</li>
        ))}
      </ul>
    </div>
  );
}
