import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { PurchaseForm } from "../components/purchases/PurchaseForm";

function StatSkeleton() {
  return <div className="rounded-2xl p-6 animate-pulse h-32" style={{ background: "#0d1424", border: "1px solid #1e293b" }} />;
}

interface StatCardProps {
  label: string; value: string | number; sub?: string;
  accent: string; iconBg: string; icon: React.ReactNode;
}

function StatCard({ label, value, sub, accent, iconBg, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl p-6 border relative overflow-hidden" style={{ background: "#0d1424", borderColor: "#1e293b" }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accent }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>{icon}</div>
      </div>
      <p className="text-2xl font-black text-slate-100 tracking-tight">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "#475569" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#334155" }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();
  const { data: purchases = [] } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="space-y-7 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back — here's your business overview.</p>
        </div>
        <button onClick={() => setPurchaseOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Purchase
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? <><StatSkeleton/><StatSkeleton/><StatSkeleton/><StatSkeleton/></> : <>
          <StatCard label="Total SKUs" value={stats?.total_skus ?? 0} sub="Active products"
            accent="linear-gradient(90deg,#6366f1,#8b5cf6)" iconBg="rgba(99,102,241,0.15)"
            icon={<svg width="18" height="18" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>} />
          <StatCard label="Stock Value" value={`₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`} sub="Inventory worth"
            accent="linear-gradient(90deg,#3b82f6,#06b6d4)" iconBg="rgba(59,130,246,0.15)"
            icon={<svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>} />
          <StatCard label="Today's Revenue" value={`₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`} sub="Sales today"
            accent="linear-gradient(90deg,#10b981,#14b8a6)" iconBg="rgba(16,185,129,0.15)"
            icon={<svg width="18" height="18" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} />
          <StatCard label="Low Stock" value={stats?.low_stock_count ?? 0} sub={stats?.low_stock_count ? "Needs restocking" : "All stocked up ✓"}
            accent={stats?.low_stock_count ? "linear-gradient(90deg,#ef4444,#f43f5e)" : "linear-gradient(90deg,#10b981,#22c55e)"}
            iconBg={stats?.low_stock_count ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)"}
            icon={<svg width="18" height="18" fill="none" stroke={stats?.low_stock_count ? "#ef4444" : "#10b981"} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
        </>}
      </div>

      {/* Cashflow */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#0d1424", borderColor: "#1e293b" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#1e293b", background: "#0f1929" }}>
          <div>
            <h2 className="text-base font-bold text-slate-100">💰 Cash Flow</h2>
            <p className="text-xs text-slate-500 mt-0.5">Capital + Revenue − Purchases</p>
          </div>
          {statsLoading ? <div className="h-8 w-36 rounded-lg animate-pulse" style={{ background: "#1e293b" }} /> : (
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Cash on Hand</p>
              <p className={`text-2xl font-black ${(stats?.cash_on_hand ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₱{(stats?.cash_on_hand ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 divide-x" style={{ divideColor: "#1e293b" }}>
          {[
            { label: "💼 Total Capital", value: stats?.total_capital ?? 0, color: "#818cf8" },
            { label: "📈 Total Revenue", value: stats?.total_revenue ?? 0, color: "#34d399" },
            { label: "🛒 Total Purchased", value: stats?.total_spent ?? 0, color: "#fbbf24" },
          ].map((item, i) => (
            <div key={item.label} className="px-6 py-4 text-center" style={{ borderLeft: i > 0 ? "1px solid #1e293b" : undefined }}>
              <p className="text-xs font-medium text-slate-600">{item.label}</p>
              {statsLoading ? <div className="h-6 w-20 mx-auto mt-1 rounded animate-pulse" style={{ background: "#1e293b" }} /> : (
                <p className="text-lg font-black mt-0.5" style={{ color: item.color }}>
                  ₱{item.value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <LowStockBanner products={products} />

      <div className="grid grid-cols-3 gap-4">
        {[
          { to: "/products", label: "Manage Products", sub: "Add, edit, track inventory", accent: "#4f46e5", iconBg: "rgba(79,70,229,0.15)",
            icon: <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg> },
          { to: "/sales", label: "Record a Sale", sub: "Log sales, update stock", accent: "#059669", iconBg: "rgba(5,150,105,0.15)",
            icon: <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg> },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="rounded-2xl p-5 border transition-all hover:border-slate-600 hover:bg-white/[0.02]" style={{ background: "#0d1424", borderColor: "#1e293b" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: item.iconBg }}>{item.icon}</div>
            <p className="font-bold text-slate-200">{item.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{item.sub}</p>
          </Link>
        ))}
        <button onClick={() => setPurchaseOpen(true)} className="rounded-2xl p-5 border text-left transition-all hover:border-slate-600 hover:bg-white/[0.02]" style={{ background: "#0d1424", borderColor: "#1e293b" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(217,119,6,0.15)" }}>
            <svg width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </div>
          <p className="font-bold text-slate-200">Record Purchase</p>
          <p className="text-xs text-slate-600 mt-0.5">Log inventory bought</p>
        </button>
      </div>

      {purchases.slice(0, 5).length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#0d1424", borderColor: "#1e293b" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#1e293b" }}>
            <h2 className="text-base font-bold text-slate-100">Recent Purchases</h2>
            <span className="text-xs text-slate-600">{purchases.length} total</span>
          </div>
          {purchases.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center px-6 py-3 transition-colors hover:bg-white/[0.02]" style={{ borderTop: i > 0 ? "1px solid #1a2234" : undefined }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0" style={{ background: "rgba(217,119,6,0.15)" }}>
                <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-300 truncate">
                  {p.product_brand ? `${p.product_brand} — ${p.product_name}` : (p.notes || "General Purchase")}
                </p>
                <p className="text-xs text-slate-600">{p.quantity} units · {new Date(p.purchased_at).toLocaleDateString("en-PH")}</p>
              </div>
              <p className="text-sm font-bold text-amber-400 mr-3">−₱{p.total_cost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
              <button onClick={() => voidPurchase.mutate(p.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
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
