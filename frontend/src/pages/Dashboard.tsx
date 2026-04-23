import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { PurchaseForm } from "../components/purchases/PurchaseForm";
import type { Purchase } from "../api/purchases";

function php(n: number, decimals = 0) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function StatCard({
  label, value, sub, warn, link,
}: { label: string; value: string; sub?: string; warn?: boolean; link?: string }) {
  const inner = (
    <div className={`bg-white border rounded-lg px-4 py-3 ${warn ? "border-red-200" : "border-gray-200"}`}>
      <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${warn ? "text-red-600" : "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
  return link ? <Link to={link} className="block hover:opacity-80 transition-opacity">{inner}</Link> : inner;
}

function Row({ label, value, bold, green, red, indent }: { label: string; value: string; bold?: boolean; green?: boolean; red?: boolean; indent?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${indent ? "pl-4" : ""}`}>
      <span className={`text-sm ${bold ? "font-semibold text-gray-800" : "text-gray-500"} ${indent ? "text-gray-400" : ""}`}>{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${green ? "text-green-700" : red ? "text-red-600" : bold ? "text-gray-900" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: products = [] } = useProducts();
  const { data: purchases = [] } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  const s = stats;
  const loading = isLoading || !s;

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={() => setPurchaseOpen(true)}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium">
          + New Purchase
        </button>
      </div>

      {/* Top KPI row — today snapshot */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Today</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Units Sold" value={loading ? "—" : String(s.today_units)} sub="today" />
          <StatCard label="Revenue" value={loading ? "—" : php(s.today_revenue, 2)} sub="today" />
          <StatCard label="Gross Profit" value={loading ? "—" : php(s.today_gross_profit, 2)} sub="today" warn={!loading && s.today_gross_profit < 0} />
          <StatCard label="Receivable" value={loading ? "—" : php(s.total_receivable, 0)} sub={`${s?.unpaid_count ?? 0} unpaid`} warn={!loading && s.total_receivable > 0} link="/sales" />
        </div>
      </div>

      {/* All-time KPI row */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">All Time</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Units Sold" value={loading ? "—" : s.total_units.toLocaleString()} sub="total" />
          <StatCard label="Products" value={loading ? "—" : String(s.total_skus)} sub="active SKUs" />
          <StatCard label="Stock Value" value={loading ? "—" : php(s.total_stock_value, 0)} sub="at sell price" />
          <StatCard label="Low Stock" value={loading ? "—" : String(s.low_stock_count)} sub="items" warn={!loading && s.low_stock_count > 0} link="/products" />
        </div>
      </div>

      {/* Income Statement + Cash Flow side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* P&L */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Income Statement</p>
            <p className="text-xs text-gray-400">All time · based on sales</p>
          </div>
          <div className="px-5 py-1 divide-y divide-gray-50">
            <Row label="Total Revenue" value={loading ? "—" : php(s.total_revenue, 2)} />
            <Row label="Cost of Goods Sold" value={loading ? "—" : `(${php(s.total_cost, 2)})`} indent />
            <div className="border-t border-gray-200 mt-1" />
            <Row
              label="Gross Profit"
              value={loading ? "—" : php(s.gross_profit, 2)}
              bold
              green={!loading && s.gross_profit >= 0}
              red={!loading && s.gross_profit < 0}
            />
            {!loading && s.total_revenue > 0 && (
              <p className="text-xs text-gray-400 pb-2">
                Margin: {((s.gross_profit / s.total_revenue) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>

        {/* Cash Flow */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Cash Position</p>
            <p className="text-xs text-gray-400">Capital + Revenue − Purchases</p>
          </div>
          <div className="px-5 py-1 divide-y divide-gray-50">
            <Row label="Partner Capital" value={loading ? "—" : php(s.total_capital, 2)} />
            <Row label="+ Total Revenue" value={loading ? "—" : php(s.total_revenue, 2)} indent />
            <Row label="− Inventory Purchases" value={loading ? "—" : `(${php(s.total_spent, 2)})`} indent />
            <div className="border-t border-gray-200 mt-1" />
            <Row
              label="Cash on Hand"
              value={loading ? "—" : php(s.cash_on_hand, 2)}
              bold
              green={!loading && s.cash_on_hand >= 0}
              red={!loading && s.cash_on_hand < 0}
            />
            {!loading && s.total_receivable > 0 && (
              <p className="text-xs text-amber-600 pb-2">
                + ₱{s.total_receivable.toLocaleString("en-PH", { minimumFractionDigits: 2 })} still to collect ({s.unpaid_count} sale{s.unpaid_count !== 1 ? "s" : ""})
              </p>
            )}
          </div>
        </div>
      </div>

      <LowStockBanner products={products} />

      {/* Partners — capital editable here */}
      <PartnersCard />

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
                    {p.quantity} units @ ₱{p.unit_cost.toFixed(2)}{p.shipping_fee > 0 ? ` · +₱${p.shipping_fee.toFixed(2)} ship` : ""}
                  </td>
                  <td className="px-5 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(p.purchased_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-2.5 font-semibold text-gray-800 text-right whitespace-nowrap">
                    ₱{p.total_cost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-right">
                    <button onClick={() => setEditingPurchase(p)} className="text-gray-400 hover:text-gray-700 text-xs mr-2 transition-colors">Edit</button>
                    <button onClick={() => { if (confirm("Delete this purchase?")) voidPurchase.mutate(p.id); }} className="text-gray-300 hover:text-red-500 text-xs transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/products", label: "Manage Products" },
          { to: "/sales", label: "View Sales" },
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

      <PurchaseForm open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
      <PurchaseForm open={!!editingPurchase} purchase={editingPurchase} onClose={() => setEditingPurchase(null)} />
    </div>
  );
}
