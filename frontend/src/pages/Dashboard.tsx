import { Link } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {statsLoading ? (
        <Spinner className="w-8 h-8" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total SKUs" value={stats?.total_skus ?? 0} />
          <StatCard label="Stock Value" value={`₱${(stats?.total_stock_value ?? 0).toFixed(2)}`} />
          <StatCard label="Today's Revenue" value={`₱${(stats?.today_revenue ?? 0).toFixed(2)}`} />
          <StatCard
            label="Low Stock"
            value={stats?.low_stock_count ?? 0}
            sub={stats?.low_stock_count ? "Needs restocking" : "All good"}
          />
        </div>
      )}

      <LowStockBanner products={products} />

      <div className="grid grid-cols-2 gap-4">
        <Link to="/products" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
          <p className="text-2xl mb-2">📦</p>
          <p className="font-semibold text-gray-900 group-hover:text-indigo-600">Manage Products</p>
          <p className="text-sm text-gray-500 mt-0.5">Add, edit, and track inventory</p>
        </Link>
        <Link to="/sales" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
          <p className="text-2xl mb-2">🛒</p>
          <p className="font-semibold text-gray-900 group-hover:text-indigo-600">Record a Sale</p>
          <p className="text-sm text-gray-500 mt-0.5">Log sales and update stock</p>
        </Link>
      </div>

      <PartnersCard />
    </div>
  );
}
