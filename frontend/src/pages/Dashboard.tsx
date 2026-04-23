import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { PurchaseForm } from "../components/purchases/PurchaseForm";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();
  const { data: purchases = [] } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="max-w-4xl space-y-8">

      {/* Page title */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={() => setPurchaseOpen(true)}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium">
          + New Purchase
        </button>
      </div>

      {/* Stats — plain row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Products", value: isLoading ? "—" : String(stats?.total_skus ?? 0), sub: "SKUs", link: null, warn: false },
          { label: "Stock Value", value: isLoading ? "—" : `₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`, sub: "inventory", link: null, warn: false },
          { label: "Today's Sales", value: isLoading ? "—" : `₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`, sub: "revenue", link: null, warn: false },
          { label: "Low Stock", value: isLoading ? "—" : String(stats?.low_stock_count ?? 0), sub: "items", link: "/products", warn: !!(stats?.low_stock_count) },
          { label: "Utang", value: isLoading ? "—" : `₱${(stats?.total_receivable ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`, sub: `${stats?.unpaid_count ?? 0} unpaid`, link: "/credits", warn: !!(stats?.total_receivable) },
        ].map((s) => (
          s.link
            ? <Link key={s.label} to={s.link} className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors block">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-xl font-bold ${s.warn ? "text-red-600" : "text-gray-900"}`}>{s.value}</p>
                {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
              </Link>
            : <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
              </div>
        ))}
      </div>

      {/* Cash on hand */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Cash on Hand</p>
            <p className="text-xs text-gray-400">Capital + Revenue − Purchases</p>
          </div>
          {isLoading
            ? <span className="text-gray-400 text-sm">Loading…</span>
            : <p className={`text-2xl font-bold ${(stats?.cash_on_hand ?? 0) >= 0 ? "text-green-700" : "text-red-600"}`}>
                ₱{(stats?.cash_on_hand ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
          }
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "Capital", value: stats?.total_capital ?? 0 },
            { label: "Revenue", value: stats?.total_revenue ?? 0 },
            { label: "Spent", value: stats?.total_spent ?? 0 },
          ].map((item) => (
            <div key={item.label} className="px-5 py-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              {isLoading
                ? <span className="text-gray-400 text-sm">—</span>
                : <p className="text-sm font-semibold text-gray-700">
                    ₱{item.value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}
                  </p>
              }
            </div>
          ))}
        </div>
      </div>

      <LowStockBanner products={products} />

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/products", label: "Manage Products" },
          { to: "/sales", label: "Record a Sale" },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            className="block bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            {item.label} →
          </Link>
        ))}
        <button onClick={() => setPurchaseOpen(true)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-left transition-colors">
          New Purchase →
        </button>
      </div>

      {/* Recent purchases */}
      {purchases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Recent Purchases</p>
            <span className="text-xs text-gray-400">{purchases.length} total</span>
          </div>
          <table className="min-w-full text-sm">
            <tbody>
              {purchases.slice(0, 5).map((p, i) => (
                <tr key={p.id} className={`${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50`}>
                  <td className="px-5 py-2.5 text-gray-700 font-medium">
                    {p.product_brand ? `${p.product_brand} — ${p.product_name}` : (p.notes || "General Purchase")}
                  </td>
                  <td className="px-5 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                    {p.quantity} units{p.shipping_fee > 0 ? ` · +₱${p.shipping_fee.toFixed(2)} ship` : ""}
                  </td>
                  <td className="px-5 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(p.purchased_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-2.5 font-semibold text-gray-800 text-right whitespace-nowrap">
                    ₱{p.total_cost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => voidPurchase.mutate(p.id)} className="text-gray-300 hover:text-red-500 text-xs transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PartnersCard />
      <PurchaseForm open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
}
