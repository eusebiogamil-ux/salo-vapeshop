import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { PurchaseForm } from "../components/purchases/PurchaseForm";

function StatSkeleton() {
  return <div className="rounded-2xl p-6 animate-pulse bg-white/60 h-32" />;
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  from: string;
  to: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, from, to, icon }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${from} ${to} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-white translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-6 w-14 h-14 rounded-full opacity-10 bg-white translate-y-4" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[13px] font-semibold uppercase tracking-widest opacity-80">{label}</p>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">{icon}</div>
        </div>
        <p className="text-3xl font-black tracking-tight mt-1">{value}</p>
        {sub && <p className="text-[13px] opacity-70 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();
  const { data: purchases = [] } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const recentPurchases = purchases.slice(0, 5);

  return (
    <div className="space-y-7 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-base text-gray-500 mt-1">Welcome back — here's your business at a glance.</p>
        </div>
        <button
          onClick={() => setPurchaseOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Purchase
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? (
          <><StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
        ) : (
          <>
            <StatCard label="Total SKUs" value={stats?.total_skus ?? 0} sub="Active products"
              from="from-indigo-500" to="to-violet-600"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>} />
            <StatCard label="Stock Value" value={`₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub="Inventory worth"
              from="from-blue-500" to="to-cyan-500"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>} />
            <StatCard label="Today's Revenue" value={`₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub="Sales today"
              from="from-emerald-500" to="to-teal-500"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} />
            <StatCard label="Low Stock" value={stats?.low_stock_count ?? 0} sub={stats?.low_stock_count ? "Needs restocking!" : "All stocked up ✓"}
              from={stats?.low_stock_count ? "from-red-500" : "from-green-500"} to={stats?.low_stock_count ? "to-rose-600" : "to-emerald-600"}
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
          </>
        )}
      </div>

      {/* Cashflow Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-base font-bold text-gray-800">💰 Cash Flow</h2>
            <p className="text-xs text-gray-500 mt-0.5">Capital + Revenue − Purchases</p>
          </div>
          {statsLoading ? (
            <div className="h-8 w-32 rounded-lg bg-gray-100 animate-pulse" />
          ) : (
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Cash on Hand</p>
              <p className={`text-2xl font-black ${(stats?.cash_on_hand ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                ₱{(stats?.cash_on_hand ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "💼 Total Capital", value: stats?.total_capital ?? 0, color: "text-indigo-600" },
            { label: "📈 Total Revenue", value: stats?.total_revenue ?? 0, color: "text-emerald-600" },
            { label: "🛒 Total Purchased", value: stats?.total_spent ?? 0, color: "text-orange-500" },
          ].map((item) => (
            <div key={item.label} className="px-6 py-4 text-center">
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              {statsLoading ? (
                <div className="h-6 w-20 mx-auto mt-1 rounded bg-gray-100 animate-pulse" />
              ) : (
                <p className={`text-lg font-bold mt-0.5 ${item.color}`}>
                  ₱{item.value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <LowStockBanner products={products} />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link to="/products" className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all text-white shadow-lg shadow-indigo-200">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>
          </div>
          <p className="font-bold text-base">Manage Products</p>
          <p className="text-[13px] opacity-75 mt-0.5">Add, edit, track inventory</p>
        </Link>
        <Link to="/sales" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all text-white shadow-lg shadow-emerald-200">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg>
          </div>
          <p className="font-bold text-base">Record a Sale</p>
          <p className="text-[13px] opacity-75 mt-0.5">Log sales, update stock</p>
        </Link>
        <button onClick={() => setPurchaseOpen(true)} className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all text-white shadow-lg shadow-orange-200 text-left w-full">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </div>
          <p className="font-bold text-base">Record Purchase</p>
          <p className="text-[13px] opacity-75 mt-0.5">Log inventory bought</p>
        </button>
      </div>

      {/* Recent Purchases */}
      {recentPurchases.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Recent Purchases</h2>
            <span className="text-xs text-gray-400">{purchases.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPurchases.map((p) => (
              <div key={p.id} className="flex items-center px-6 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3 shrink-0">
                  <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {p.product_brand ? `${p.product_brand} — ${p.product_name}` : (p.notes || "General Purchase")}
                  </p>
                  <p className="text-xs text-gray-400">{p.quantity} units · {new Date(p.purchased_at).toLocaleDateString("en-PH")}</p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-sm font-bold text-orange-600">−₱{p.total_cost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
                </div>
                <button
                  onClick={() => voidPurchase.mutate(p.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-xs"
                  title="Void purchase"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <PartnersCard />

      <PurchaseForm open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
}
