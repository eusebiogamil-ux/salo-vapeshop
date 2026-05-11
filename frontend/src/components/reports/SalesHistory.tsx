import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useSalesHistory } from "../../hooks/useReports";
import { salesHistoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

interface Props { fromDate?: string; toDate?: string; }

const card = {
  background: "#fff",
  border: "1px solid #e3e8ef",
  borderRadius: "16px",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

export function SalesHistory({ fromDate, toDate }: Props) {
  const { data, isLoading } = useSalesHistory({ from_date: fromDate, to_date: toDate });
  if (isLoading) return <Spinner className="w-5 h-5 mx-auto my-6" />;

  const totalRevenue = data?.reduce((s, r) => s + r.total_revenue, 0) ?? 0;
  const totalProfit  = data?.reduce((s, r) => s + r.total_profit, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#a3acb9" }}>
          Revenue:{" "}
          <strong className="tabular-nums" style={{ color: "#1a1f36" }}>₱{totalRevenue.toFixed(2)}</strong>
          {"  ·  "}
          Profit:{" "}
          <strong className={`tabular-nums ${totalProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>₱{totalProfit.toFixed(2)}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(salesHistoryCsvUrl({ from_date: fromDate, to_date: toDate }), "_blank")}>Export CSV</Button>
      </div>
      <div style={card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                {["Brand", "Product", "Units Sold", "Revenue", "Cost", "Profit", "Margin"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: "#a3acb9" }}>No sales in this period.</td></tr>
              )}
              {(data ?? []).map((r, i) => (
                <tr key={r.product_id} className="hover:bg-[#f6f9fc] transition-colors" style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#1a1f36" }}>{r.product_brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#697386" }}>{r.product_name}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: "#1a1f36" }}>{r.units_sold}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>₱{r.total_revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#a3acb9" }}>₱{r.total_cost.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge variant={r.total_profit >= 0 ? "green" : "red"}>₱{r.total_profit.toFixed(2)}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={r.margin_pct >= 30 ? "green" : r.margin_pct >= 15 ? "yellow" : "red"}>{r.margin_pct.toFixed(1)}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
