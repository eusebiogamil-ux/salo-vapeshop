import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";

function StatSkeleton() {
  return (
    <div className="rounded-2xl p-6 animate-pulse bg-white/60 h-32" />
  );
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
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-white translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-6 w-14 h-14 rounded-full opacity-10 bg-white translate-y-4" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[13px] font-semibold uppercase tracking-widest opacity-80">{label}</p>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
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

  return (
    <div className="space-y-7 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-base text-gray-500 mt-1">Welcome back — here's your business at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total SKUs"
              value={stats?.total_skus ?? 0}
              sub="Active products"
              from="from-indigo-500" to="to-violet-600"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>}
            />
            <StatCard
              label="Stock Value"
              value={`₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sub="Inventory worth"
              from="from-blue-500" to="to-cyan-500"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>}
            />
            <StatCard
              label="Today's Revenue"
              value={`₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sub="Sales today"
              from="from-emerald-500" to="to-teal-500"
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
            />
            <StatCard
              label="Low Stock"
              value={stats?.low_stock_count ?? 0}
              sub={stats?.low_stock_count ? "Needs restocking!" : "All stocked up ✓"}
              from={stats?.low_stock_count ? "from-red-500" : "from-green-500"}
              to={stats?.low_stock_count ? "to-rose-600" : "to-emerald-600"}
              icon={<svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            />
          </>
        )}
      </div>

      <LowStockBanner products={products} />

      <div className="grid grid-cols-2 gap-5">
        <Link to="/products" className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group text-white shadow-lg shadow-indigo-200">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>
          </div>
          <p className="text-lg font-bold">Manage Products</p>
          <p className="text-[14px] opacity-75 mt-0.5">Add, edit, and track inventory</p>
        </Link>
        <Link to="/sales" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group text-white shadow-lg shadow-emerald-200">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg>
          </div>
          <p className="text-lg font-bold">Record a Sale</p>
          <p className="text-[14px] opacity-75 mt-0.5">Log sales and update stock</p>
        </Link>
      </div>

      <PartnersCard />
    </div>
  );
}
