import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useSalesHistory } from "../../hooks/useReports";
import { salesHistoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#475569" }}>{children}</th>
);

interface Props { fromDate?: string; toDate?: string; }

export function SalesHistory({ fromDate, toDate }: Props) {
  const { data, isLoading } = useSalesHistory({ from_date: fromDate, to_date: toDate });
  if (isLoading) return <Spinner className="w-6 h-6 mx-auto my-8" />;

  const totalRevenue = data?.reduce((s, r) => s + r.total_revenue, 0) ?? 0;
  const totalProfit = data?.reduce((s, r) => s + r.total_profit, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Revenue: <strong className="text-emerald-400 font-bold">₱{totalRevenue.toFixed(2)}</strong>
          &nbsp;·&nbsp;
          Profit: <strong className={totalProfit >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>₱{totalProfit.toFixed(2)}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(salesHistoryCsvUrl({ from_date: fromDate, to_date: toDate }), "_blank")}>Export CSV</Button>
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1e293b" }}>
        <table className="min-w-full text-sm">
          <thead style={{ background: "#0d1424" }}>
            <tr><TH>Brand</TH><TH>Product</TH><TH>Units Sold</TH><TH>Revenue</TH><TH>Cost</TH><TH>Profit</TH><TH>Margin</TH></tr>
          </thead>
          <tbody style={{ background: "#0a0e1a" }}>
            {(data ?? []).length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-600">No sales in this period.</td></tr>
            )}
            {(data ?? []).map((r) => (
              <tr key={r.product_id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: "#1a2234" }}>
                <td className="px-4 py-3 font-bold text-slate-200 whitespace-nowrap">{r.product_brand}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.product_name}</td>
                <td className="px-4 py-3 font-bold text-slate-200">{r.units_sold}</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">₱{r.total_revenue.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-500">₱{r.total_cost.toFixed(2)}</td>
                <td className="px-4 py-3"><Badge variant={r.total_profit >= 0 ? "green" : "red"}>₱{r.total_profit.toFixed(2)}</Badge></td>
                <td className="px-4 py-3"><Badge variant={r.margin_pct >= 30 ? "green" : r.margin_pct >= 15 ? "yellow" : "red"}>{r.margin_pct.toFixed(1)}%</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
