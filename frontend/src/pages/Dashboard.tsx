import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { PurchaseForm } from "../components/purchases/PurchaseForm";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();
  const { data: purchases = [] } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button onClick={() => setPurchaseOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Purchase
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Products", value: statsLoading ? null : String(stats?.total_skus ?? 0), sub: "SKUs" },
          { label: "Stock Value", value: statsLoading ? null : `₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`, sub: "inventory" },
          { label: "Today", value: statsLoading ? null : `₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`, sub: "revenue" },
          { label: "Low Stock", value: statsLoading ? null : String(stats?.low_stock_count ?? 0), sub: "items", warn: !!(stats?.low_stock_count) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl px-4 py-4 bg-white border border-slate-200 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{s.label}</p>
            {s.value === null
              ? <Skeleton className="h-7 w-20 mt-1" />
              : <p className={`text-2xl font-black tracking-tight ${s.warn ? "text-red-600" : "text-slate-900"}`}>{s.value}</p>
            }
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Cash on Hand */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-800">Cash on Hand</p>
            <p className="text-xs text-slate-400 mt-0.5">Capital + Revenue − Purchases</p>
          </div>
          {statsLoading
            ? <Skeleton className="h-8 w-32" />
            : <p className={`text-3xl font-black tabular-nums ${(stats?.cash_on_hand ?? 0) >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                ₱{(stats?.cash_on_hand ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
          }
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
            { label: "Capital", value: stats?.total_capital ?? 0, color: "text-slate-700" },
            { label: "Revenue", value: stats?.total_revenue ?? 0, color: "text-emerald-700" },
            { label: "Spent", value: stats?.total_spent ?? 0, color: "text-amber-600" },
          ].map((item) => (
            <div key={item.label} className="px-5 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">{item.label}</p>
              {statsLoading
                ? <Skeleton className="h-5 w-16 mx-auto" />
                : <p className={`text-sm font-bold tabular-nums ${item.color}`}>
                    ₱{item.value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}
                  </p>
              }
            </div>
          ))}
        </div>
      </div>

      <LowStockBanner products={products} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/products" className="flex items-center gap-3 rounded-xl p-4 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" fill="none" stroke="#4f46e5" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Products</p>
            <p className="text-xs text-slate-400">Add · edit · stock</p>
          </div>
        </Link>
        <Link to="/sales" className="flex items-center gap-3 rounded-xl p-4 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Record Sale</p>
            <p className="text-xs text-slate-400">Log · deduct stock</p>
          </div>
        </Link>
        <button onClick={() => setPurchaseOpen(true)} className="flex items-center gap-3 rounded-xl p-4 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all text-left">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">New Purchase</p>
            <p className="text-xs text-slate-400">Log restocks + shipping</p>
          </div>
        </button>
      </div>

      {/* Recent purchases */}
      {purchases.length > 0 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-700">Recent Purchases</p>
            <span className="text-xs text-slate-400">{purchases.length} total</span>
          </div>
          {purchases.slice(0, 5).map((p, i) => (
            <div key={p.id} className={`flex items-center px-5 py-3 gap-3 hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 truncate font-medium">
                  {p.product_brand ? `${p.product_brand} — ${p.product_name}` : (p.notes || "General Purchase")}
                </p>
                <p className="text-xs text-slate-400">
                  {p.quantity} units
                  {p.shipping_fee > 0 && <span> · +₱{p.shipping_fee.toFixed(2)} shipping</span>}
                  {" · "}{new Date(p.purchased_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                </p>
              </div>
              <p className="text-sm font-bold text-amber-600 shrink-0">
                −₱{p.total_cost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
              <button
                onClick={() => voidPurchase.mutate(p.id)}
                className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <PartnersCard />
      <PurchaseForm open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
}
