import type { Product } from "../../api/products";

export function LowStockBanner({ products }: { products: Product[] }) {
  const low = products.filter((p) => p.is_low_stock);
  if (low.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
      <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ {low.length} product{low.length > 1 ? "s" : ""} running low on stock</p>
      <ul className="text-sm text-yellow-700 list-disc list-inside space-y-0.5">
        {low.map((p) => (
          <li key={p.id}>
            {p.brand} — {p.name}: <strong>{p.stock_quantity}</strong> left (threshold: {p.low_stock_threshold})
          </li>
        ))}
      </ul>
    </div>
  );
}
