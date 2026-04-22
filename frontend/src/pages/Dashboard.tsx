import { Link } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's your business at a glance.</p>
      </div>

      {statsLoading ? (
        <Spinner className="w-8 h-8" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total SKUs"
            value={stats?.total_skus ?? 0}
            sub="Active products"
            accent="bg-indigo-50 text-indigo-600"
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>
            }
          />
          <StatCard
            label="Stock Value"
            value={`₱${(stats?.total_stock_value ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            sub="Total inventory worth"
            accent="bg-blue-50 text-blue-600"
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4M10 14h4"/></svg>
            }
          />
          <StatCard
            label="Today's Revenue"
            value={`₱${(stats?.today_revenue ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            sub="Sales recorded today"
            accent="bg-emerald-50 text-emerald-600"
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            }
          />
          <StatCard
            label="Low Stock"
            value={stats?.low_stock_count ?? 0}
            sub={stats?.low_stock_count ? "Needs restocking" : "All stocked up ✓"}
            accent={stats?.low_stock_count ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            }
          />
        </div>
      )}

      <LowStockBanner products={products} />

      <div className="grid grid-cols-2 gap-4">
        <Link to="/products" className="bg-white border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all group shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
            <svg width="20" height="20" fill="none" stroke="#4f46e5" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8V21H3V8"/><path d="M23 3H1l2 5h18l2-5Z"/><path d="M10 12h4"/></svg>
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Manage Products</p>
          <p className="text-sm text-gray-400 mt-0.5">Add, edit, and track inventory</p>
        </Link>
        <Link to="/sales" className="bg-white border border-gray-100 rounded-xl p-5 hover:border-emerald-200 hover:shadow-md transition-all group shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
            <svg width="20" height="20" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1H5L7.68 14.39A2 2 0 0 0 9.64 16H19.4A2 2 0 0 0 21.36 14.39L23 6H6"/></svg>
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Record a Sale</p>
          <p className="text-sm text-gray-400 mt-0.5">Log sales and update stock</p>
        </Link>
      </div>

      <PartnersCard />
    </div>
  );
}
