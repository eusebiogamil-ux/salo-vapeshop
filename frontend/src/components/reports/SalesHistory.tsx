import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useSalesHistory } from "../../hooks/useReports";
import { salesHistoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

interface Props { fromDate?: string; toDate?: string; }

export function SalesHistory({ fromDate, toDate }: Props) {
  const { data, isLoading } = useSalesHistory({ from_date: fromDate, to_date: toDate });
  if (isLoading) return <Spinner className="w-5 h-5 mx-auto my-6" />;

  const totalRevenue = data?.reduce((s, r) => s + r.total_revenue, 0) ?? 0;
  const totalProfit = data?.reduce((s, r) => s + r.total_profit, 0) ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Revenue: <strong className="text-gray-800">₱{totalRevenue.toFixed(2)}</strong>
          {" · "}
          Profit: <strong className={totalProfit >= 0 ? "text-green-700" : "text-red-600"}>₱{totalProfit.toFixed(2)}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(salesHistoryCsvUrl({ from_date: fromDate, to_date: toDate }), "_blank")}>Export CSV</Button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Brand","Product","Units Sold","Revenue","Cost","Profit","Margin"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No sales in this period.</td></tr>
              )}
              {(data ?? []).map((r, i) => (
                <tr key={r.product_id} className={`hover:bg-gray-50 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-800 whitespace-nowrap">{r.product_brand}</td>
                  <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{r.product_name}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{r.units_sold}</td>
                  <td className="px-4 py-2.5 text-gray-700">₱{r.total_revenue.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-gray-400">₱{r.total_cost.toFixed(2)}</td>
                  <td className="px-4 py-2.5"><Badge variant={r.total_profit >= 0 ? "green" : "red"}>₱{r.total_profit.toFixed(2)}</Badge></td>
                  <td className="px-4 py-2.5"><Badge variant={r.margin_pct >= 30 ? "green" : r.margin_pct >= 15 ? "yellow" : "red"}>{r.margin_pct.toFixed(1)}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
