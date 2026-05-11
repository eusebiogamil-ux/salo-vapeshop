import { useState } from "react";
import { Input } from "../components/ui/Input";
import { InventorySummary } from "../components/reports/InventorySummary";
import { SalesHistory } from "../components/reports/SalesHistory";
import { useDashboardStats, useMonthlyPl } from "../hooks/useReports";
import { Spinner } from "../components/ui/Spinner";

function php(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const tabs = ["Income Statement", "Balance Sheet", "Monthly P&L", "Inventory", "Sales History"] as const;
type Tab = typeof tabs[number];

function StatRow({ label, value, indent, bold, positive, negative, sub, topBorder }: {
  label: string; value: string; indent?: boolean; bold?: boolean;
  positive?: boolean; negative?: boolean; sub?: string; topBorder?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${indent ? "pl-6" : ""}`}
      style={{ borderTop: topBorder ? "2px solid #e3e8ef" : "1px solid #f4f6f8" }}>
      <span className="text-sm" style={{ color: bold ? "#1a1f36" : indent ? "#a3acb9" : "#697386", fontWeight: bold ? 600 : 400 }}>{label}</span>
      <div className="text-right">
        <p className="text-sm tabular-nums" style={{ color: positive ? "#0e7c59" : negative ? "#d92d20" : bold ? "#1a1f36" : "#697386", fontWeight: bold ? 700 : 500 }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "#a3acb9" }}>{sub}</p>}
      </div>
    </div>
  );
}

const card = { background: "#fff", border: "1px solid #e3e8ef", borderRadius: "16px", boxShadow: "0 1px 3px rgba(10,37,64,0.05)" };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 mt-4 first:mt-0" style={{ color: "#c2c8d0" }}>{children}</p>;
}

function MonthlyPlTable() {
  const { data, isLoading } = useMonthlyPl();
  if (isLoading) return <Spinner className="w-5 h-5 mx-auto my-8" />;

  const totalRevenue = data?.reduce((s, r) => s + r.revenue, 0) ?? 0;
  const totalProfit  = data?.reduce((s, r) => s + r.gross_profit, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#a3acb9" }}>
          All-time revenue:{" "}
          <strong className="tabular-nums" style={{ color: "#1a1f36" }}>{php(totalRevenue)}</strong>
          {"  ·  "}
          All-time profit:{" "}
          <strong className={`tabular-nums ${totalProfit >= 0 ? "text-emerald-700" : "text-red-500"}`}>{php(totalProfit)}</strong>
        </p>
      </div>
      <div style={card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                {["Month", "Units", "Revenue", "COGS", "Gross Profit", "Margin"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "#a3acb9" }}>No sales data yet.</td></tr>
              )}
              {(data ?? []).map((r, i) => {
                const margin = r.revenue > 0 ? (r.gross_profit / r.revenue) * 100 : 0;
                return (
                  <tr key={`${r.year}-${r.month}`} className="hover:bg-[#f6f9fc] transition-colors" style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}>
                    <td className="px-5 py-3 font-semibold" style={{ color: "#1a1f36" }}>{r.label}</td>
                    <td className="px-5 py-3 tabular-nums" style={{ color: "#697386" }}>{r.units.toLocaleString()}</td>
                    <td className="px-5 py-3 tabular-nums font-medium" style={{ color: "#1a1f36" }}>{php(r.revenue)}</td>
                    <td className="px-5 py-3 tabular-nums" style={{ color: "#a3acb9" }}>{php(r.cogs)}</td>
                    <td className={`px-5 py-3 tabular-nums font-semibold ${r.gross_profit >= 0 ? "text-emerald-700" : "text-red-500"}`}>{php(r.gross_profit)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${margin >= 30 ? "bg-emerald-50 text-emerald-700" : margin >= 15 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(data ?? []).length > 1 && (
                <tr style={{ borderTop: "2px solid #e3e8ef", background: "#f6f9fc" }}>
                  <td className="px-5 py-3 text-xs font-bold" style={{ color: "#697386" }}>Total</td>
                  <td className="px-5 py-3 text-xs tabular-nums font-semibold" style={{ color: "#1a1f36" }}>{data!.reduce((s, r) => s + r.units, 0).toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs tabular-nums font-semibold" style={{ color: "#1a1f36" }}>{php(totalRevenue)}</td>
                  <td className="px-5 py-3 text-xs tabular-nums" style={{ color: "#a3acb9" }}>{php(data!.reduce((s, r) => s + r.cogs, 0))}</td>
                  <td className={`px-5 py-3 text-xs tabular-nums font-bold ${totalProfit >= 0 ? "text-emerald-700" : "text-red-500"}`}>{php(totalProfit)}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "#a3acb9" }}>{totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : "—"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [tab, setTab] = useState<Tab>("Income Statement");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const { data: stats, isLoading } = useDashboardStats();

  const s       = stats;
  const loading = isLoading || !s;

  const atlGrossProfit = loading ? 0 : s.atl_gross_profit;
  const cashOnHand     = loading ? 0 : s.cash_on_hand;
  const inventoryCost  = loading ? 0 : s.total_inventory_cost;
  const totalAssets    = cashOnHand + inventoryCost + (loading ? 0 : s.total_receivable);
  const totalEquity    = loading ? 0 : s.total_capital + atlGrossProfit;
  const margin         = loading || s.atl_revenue === 0 ? 0 : (atlGrossProfit / s.atl_revenue) * 100;

  return (
    <div className="max-w-5xl space-y-6 print:space-y-4">

      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a1f36" }}>Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>Financial statements and analytics</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm px-3.5 py-1.5 rounded-xl font-medium transition-colors"
          style={{ background: "#fff", border: "1px solid #e3e8ef", color: "#697386", boxShadow: "0 1px 2px rgba(10,37,64,0.04)" }}
        >
          Export PDF
        </button>
      </div>

      {/* Print header (only shows when printing) */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salo Vapeshop — {tab}</h1>
        <p className="text-sm text-gray-500 mt-1">Generated {new Date().toLocaleDateString("en-PH", { dateStyle: "long" })}</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl w-fit flex-wrap print:hidden" style={{ background: "#f0f3f7", border: "1px solid #e3e8ef" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={tab === t
              ? { background: "#fff", color: "#1a1f36", boxShadow: "0 1px 3px rgba(10,37,64,0.1)" }
              : { color: "#697386" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Income Statement */}
      {tab === "Income Statement" && (
        <div className="max-w-lg">
          <div style={card} className="overflow-hidden">
            <div className="px-6 pt-5 pb-3" style={{ borderBottom: "1px solid #f0f3f6" }}>
              <p className="text-base font-bold" style={{ color: "#1a1f36" }}>Income Statement</p>
              <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>All time · profit and loss from sales</p>
            </div>
            <div className="px-6 pb-4">
              <SectionLabel>Revenue</SectionLabel>
              <StatRow label="Gross Revenue" value={loading ? "—" : php(s.atl_revenue)} />
              <SectionLabel>Cost</SectionLabel>
              <StatRow label="Cost of Goods Sold" value={loading ? "—" : `(${php(s.atl_cost)})`} indent />
              <StatRow label="Gross Profit" value={loading ? "—" : php(atlGrossProfit)} sub={`${margin.toFixed(1)}% margin`} bold positive={!loading && atlGrossProfit >= 0} negative={!loading && atlGrossProfit < 0} topBorder />
              <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid #f0f3f6" }}>
                <div className="flex justify-between text-xs" style={{ color: "#a3acb9" }}>
                  <span>Total Units Sold</span>
                  <span className="font-semibold tabular-nums" style={{ color: "#697386" }}>{loading ? "—" : s.atl_units.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: "#a3acb9" }}>
                  <span>Avg Selling Price</span>
                  <span className="font-semibold tabular-nums" style={{ color: "#697386" }}>
                    {loading || s.atl_units === 0 ? "—" : php(s.atl_revenue / s.atl_units)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {tab === "Balance Sheet" && (
        <div className="max-w-lg">
          <div style={card} className="overflow-hidden">
            <div className="px-6 pt-5 pb-3" style={{ borderBottom: "1px solid #f0f3f6" }}>
              <p className="text-base font-bold" style={{ color: "#1a1f36" }}>Balance Sheet</p>
              <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>Current snapshot · assets and equity</p>
            </div>
            <div className="px-6 pb-4">
              <SectionLabel>Assets</SectionLabel>
              <StatRow label="Cash & Equivalents"  value={loading ? "—" : php(cashOnHand)} />
              <StatRow label="Inventory at Cost"   value={loading ? "—" : php(inventoryCost)} indent />
              <StatRow label="Accounts Receivable" value={loading ? "—" : php(s.total_receivable)} indent />
              <StatRow label="Total Assets" value={loading ? "—" : php(totalAssets)} bold topBorder />
              <SectionLabel>Equity</SectionLabel>
              <StatRow label="Partner Capital"   value={loading ? "—" : php(s.total_capital)} />
              <StatRow label="Retained Earnings" value={loading ? "—" : php(atlGrossProfit)} indent positive={!loading && atlGrossProfit >= 0} negative={!loading && atlGrossProfit < 0} />
              <StatRow label="Total Equity" value={loading ? "—" : php(totalEquity)} bold topBorder positive={!loading && totalEquity >= 0} negative={!loading && totalEquity < 0} />
              {!loading && (
                <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: "1px solid #f0f3f6" }}>
                  <div className={`w-2 h-2 rounded-full ${Math.abs(totalAssets - totalEquity - s.total_receivable) < 1 ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <p className="text-xs" style={{ color: "#a3acb9" }}>
                    {Math.abs(totalAssets - totalEquity - s.total_receivable) < 1 ? "Balanced" : "Check figures"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Monthly P&L */}
      {tab === "Monthly P&L" && <MonthlyPlTable />}

      {/* Inventory */}
      {tab === "Inventory" && <InventorySummary />}

      {/* Sales History */}
      {tab === "Sales History" && (
        <div className="space-y-4">
          <div className="flex items-end gap-3 flex-wrap print:hidden">
            <div className="flex items-end gap-2">
              <Input label="From" type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <Input label="To"   type="datetime-local" value={toDate}   onChange={(e) => setToDate(e.target.value)} />
            </div>
            {(fromDate || toDate) && (
              <button onClick={() => { setFromDate(""); setToDate(""); }}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-[#f0f3f7]"
                style={{ color: "#697386", border: "1px solid #e3e8ef" }}>
                Clear
              </button>
            )}
          </div>
          <SalesHistory
            fromDate={fromDate ? new Date(fromDate).toISOString() : undefined}
            toDate={toDate   ? new Date(toDate).toISOString()   : undefined}
          />
        </div>
      )}

    </div>
  );
}
