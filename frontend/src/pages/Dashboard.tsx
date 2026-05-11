import { useState } from "react";
import { Link } from "react-router-dom";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { useDashboardStats } from "../hooks/useReports";
import { useProducts } from "../hooks/useProducts";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { PartnersCard } from "../components/partners/PartnersCard";
import { SaleForm } from "../components/sales/SaleForm";

function php(n: number, decimals = 2) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const PERIODS = [
  { label: "Today",     key: "today" },
  { label: "This Week", key: "week"  },
  { label: "This Month",key: "month" },
  { label: "All Time",  key: "all"   },
] as const;
type PeriodKey = typeof PERIODS[number]["key"];

function getPeriodDates(p: PeriodKey): { from_date?: string; to_date?: string } {
  const now = new Date();
  if (p === "today") return { from_date: startOfDay(now).toISOString(),                         to_date: now.toISOString() };
  if (p === "week")  return { from_date: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),    to_date: now.toISOString() };
  if (p === "month") return { from_date: startOfMonth(now).toISOString(),                        to_date: now.toISOString() };
  return {};
}

function KpiCard({ label, value, sub, warn, link }: {
  label: string; value: string; sub?: string; warn?: boolean; link?: string;
}) {
  const inner = (
    <div className="px-5 py-4 rounded-2xl" style={{
      background: "#fff", border: `1px solid ${warn ? "#fca5a5" : "#e3e8ef"}`,
      boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
    }}>
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#a3acb9" }}>{label}</p>
      <p className={`text-[22px] font-bold tracking-tight tabular-nums leading-none ${warn ? "text-red-500" : "text-[#1a1f36]"}`}>{value}</p>
      {sub && <p className="text-xs mt-1.5" style={{ color: "#c2c8d0" }}>{sub}</p>}
    </div>
  );
  return link ? <Link to={link} className="block hover:opacity-90 transition-opacity">{inner}</Link> : inner;
}

function StatRow({ label, value, sub, indent, bold, positive, negative }: {
  label: string; value: string; sub?: string; indent?: boolean; bold?: boolean; positive?: boolean; negative?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${indent ? "pl-5" : ""}`} style={{ borderBottom: "1px solid #f4f6f8" }}>
      <span className="text-sm" style={{ color: bold ? "#1a1f36" : indent ? "#b0b8c4" : "#697386", fontWeight: bold ? 600 : 400 }}>{label}</span>
      <div className="text-right">
        <span className="text-sm tabular-nums" style={{
          color: positive ? "#0e7c59" : negative ? "#d92d20" : bold ? "#1a1f36" : "#697386",
          fontWeight: bold ? 700 : 500,
        }}>{value}</span>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "#c2c8d0" }}>{sub}</p>}
      </div>
    </div>
  );
}

function FinCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e3e8ef", boxShadow: "0 1px 3px rgba(10,37,64,0.05)" }}>
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid #f0f3f6" }}>
        <p className="text-sm font-semibold" style={{ color: "#1a1f36" }}>{title}</p>
        {subtitle && <p className="text-[11px] mt-0.5" style={{ color: "#a3acb9" }}>{subtitle}</p>}
      </div>
      <div className="px-5 pt-1 pb-3">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState<PeriodKey>("all");
  const [saleOpen, setSaleOpen] = useState(false);

  const periodDates = getPeriodDates(period);
  const { data: stats, isLoading } = useDashboardStats(periodDates);
  const { data: products = [] } = useProducts();

  const s = stats;
  const loading = isLoading || !s;

  // Balance sheet always uses all-time figures
  const atlGrossProfit  = loading ? 0 : s.atl_gross_profit;
  const cashOnHand      = loading ? 0 : s.cash_on_hand;
  const inventoryCost   = loading ? 0 : s.total_inventory_cost;
  const totalAssets     = cashOnHand + inventoryCost + (loading ? 0 : s.total_receivable);
  const totalEquity     = loading ? 0 : s.total_capital + atlGrossProfit;

  // KPI cards & income statement use period-filtered figures
  const revenue     = loading ? 0 : s.total_revenue;
  const grossProfit = loading ? 0 : s.gross_profit;
  const margin      = revenue === 0 ? 0 : (grossProfit / revenue) * 100;
  const periodLabel = PERIODS.find(p => p.key === period)?.label ?? "All Time";

  return (
    <div className="max-w-5xl space-y-7">

      {/* Hero */}
      <div className="rounded-2xl px-7 py-6" style={{ background: "#0a2540", boxShadow: "0 4px 24px rgba(10,37,64,0.18)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a7fa5" }}>Cash on Hand</p>
            <p className="text-[42px] font-black tracking-tight leading-none text-white tabular-nums">
              {loading ? "—" : php(cashOnHand)}
            </p>
          </div>
          <button
            onClick={() => setSaleOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors mt-1"
            style={{ background: "#635bff", color: "#fff", boxShadow: "0 1px 3px rgba(99,91,255,0.4)" }}
          >
            + Record Sale
          </button>
        </div>

        <div className="mt-5 pt-4 flex flex-wrap gap-x-8 gap-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4a7fa5" }}>Today Revenue</p>
            <p className="text-base font-bold text-white tabular-nums mt-0.5">{loading ? "—" : php(s.today_revenue)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4a7fa5" }}>Today Units</p>
            <p className="text-base font-bold text-white mt-0.5">{loading ? "—" : s.today_units}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4a7fa5" }}>Today Profit</p>
            <p className={`text-base font-bold mt-0.5 tabular-nums ${!loading && s.today_gross_profit < 0 ? "text-red-400" : "text-emerald-400"}`}>
              {loading ? "—" : php(s.today_gross_profit)}
            </p>
          </div>
          {!loading && s.total_receivable > 0 && (
            <Link to="/sales" className="ml-auto self-end">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-right" style={{ color: "#4a7fa5" }}>Receivable</p>
              <p className="text-base font-bold text-amber-400 tabular-nums mt-0.5 text-right">
                {php(s.total_receivable)} <span className="text-xs font-medium">({s.unpaid_count})</span>
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Period filter + KPI cards */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#a3acb9" }}>{periodLabel}</p>
          <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: "#f0f3f7", border: "1px solid #e3e8ef" }}>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="px-3 py-1 text-[11px] font-semibold rounded-lg transition-all"
                style={period === p.key
                  ? { background: "#fff", color: "#1a1f36", boxShadow: "0 1px 3px rgba(10,37,64,0.1)" }
                  : { color: "#697386" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Revenue"     value={loading ? "—" : php(revenue)}                     sub={periodLabel.toLowerCase()} />
          <KpiCard label="Gross Profit" value={loading ? "—" : php(grossProfit)}                sub={`${margin.toFixed(1)}% margin`} warn={!loading && grossProfit < 0} />
          <KpiCard label="Units Sold"  value={loading ? "—" : s.total_units.toLocaleString()}   sub={periodLabel.toLowerCase()} />
          <KpiCard label="Low Stock"   value={loading ? "—" : String(s.low_stock_count)}        sub={`of ${s?.total_skus ?? 0} SKUs`} warn={!loading && s.low_stock_count > 0} link="/products" />
        </div>
      </div>

      {/* Income Statement + Balance Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <FinCard title="Income Statement" subtitle={`${periodLabel} · revenue from sales`}>
          <StatRow label="Revenue" value={loading ? "—" : php(revenue)} />
          <StatRow label="Cost of Goods Sold" value={loading ? "—" : `(${php(s?.total_cost ?? 0)})`} indent />
          <div style={{ borderTop: "2px solid #e3e8ef", margin: "4px 0" }} />
          <StatRow label="Gross Profit" value={loading ? "—" : php(grossProfit)} sub={`${margin.toFixed(1)}% margin`} bold positive={!loading && grossProfit >= 0} negative={!loading && grossProfit < 0} />
        </FinCard>

        <FinCard title="Balance Sheet" subtitle="Current snapshot · all time">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mt-2 mb-0.5" style={{ color: "#c2c8d0" }}>Assets</p>
            <StatRow label="Cash & Equivalents"  value={loading ? "—" : php(cashOnHand)} />
            <StatRow label="Inventory at Cost"   value={loading ? "—" : php(inventoryCost)} indent />
            <StatRow label="Accounts Receivable" value={loading ? "—" : php(s?.total_receivable ?? 0)} indent />
            <div style={{ borderTop: "2px solid #e3e8ef", margin: "4px 0" }} />
            <StatRow label="Total Assets" value={loading ? "—" : php(totalAssets)} bold />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mt-3 mb-0.5" style={{ color: "#c2c8d0" }}>Equity</p>
            <StatRow label="Partner Capital"   value={loading ? "—" : php(s?.total_capital ?? 0)} />
            <StatRow label="Retained Earnings" value={loading ? "—" : php(atlGrossProfit)} indent positive={!loading && atlGrossProfit >= 0} negative={!loading && atlGrossProfit < 0} />
            <div style={{ borderTop: "2px solid #e3e8ef", margin: "4px 0" }} />
            <StatRow label="Total Equity" value={loading ? "—" : php(totalEquity)} bold positive={!loading && totalEquity >= 0} negative={!loading && totalEquity < 0} />
          </div>
        </FinCard>

      </div>

      <LowStockBanner products={products} />
      <PartnersCard />

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: "/sales",     label: "Sales Records" },
          { to: "/purchases", label: "Purchases"     },
          { to: "/products",  label: "Products"      },
          { to: "/reports",   label: "Reports"       },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            className="block px-4 py-3 text-sm font-medium rounded-2xl transition-colors hover:bg-[#f0f3f7]"
            style={{ background: "#fff", border: "1px solid #e3e8ef", boxShadow: "0 1px 3px rgba(10,37,64,0.04)", color: "#697386" }}>
            {item.label} →
          </Link>
        ))}
      </div>

      <SaleForm open={saleOpen} onClose={() => setSaleOpen(false)} />
    </div>
  );
}
