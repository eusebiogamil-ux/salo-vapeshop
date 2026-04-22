import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useSalesHistory } from "../../hooks/useReports";
import { salesHistoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

const TH = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 whitespace-nowrap">{children}</th>
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
        <p className="text-sm text-slate-600">
          Revenue: <strong className="text-emerald-700">₱{totalRevenue.toFixed(2)}</strong>
          &nbsp;·&nbsp;
          Profit: <strong className={totalProfit >= 0 ? "text-emerald-700" : "text-red-600"}>₱{totalProfit.toFixed(2)}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(salesHistoryCsvUrl({ from_date: fromDate, to_date: toDate }), "_blank")}>Export CSV</Button>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <TH>Brand</TH><TH>Product</TH><TH>Units Sold</TH><TH>Revenue</TH><TH>Cost</TH><TH>Profit</TH><TH>Margin</TH>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No sales in this period.</td></tr>
              )}
              {(data ?? []).map((r, i) => (
                <tr key={r.product_id} className={`hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.product_brand}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{r.product_name}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{r.units_sold}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">₱{r.total_revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">₱{r.total_cost.toFixed(2)}</td>
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
