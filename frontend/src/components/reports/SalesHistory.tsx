import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useSalesHistory } from "../../hooks/useReports";
import { salesHistoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

interface Props {
  fromDate?: string;
  toDate?: string;
}

export function SalesHistory({ fromDate, toDate }: Props) {
  const { data, isLoading } = useSalesHistory({ from_date: fromDate, to_date: toDate });

  if (isLoading) return <Spinner className="w-6 h-6 mx-auto my-8" />;

  const totalRevenue = data?.reduce((s, r) => s + r.total_revenue, 0) ?? 0;
  const totalProfit = data?.reduce((s, r) => s + r.total_profit, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Revenue: <strong className="text-gray-900">₱{totalRevenue.toFixed(2)}</strong>
          &nbsp;·&nbsp;
          Profit: <strong className={totalProfit >= 0 ? "text-green-700" : "text-red-600"}>₱{totalProfit.toFixed(2)}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(salesHistoryCsvUrl({ from_date: fromDate, to_date: toDate }), "_blank")}>Export CSV</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Brand", "Product", "Units Sold", "Revenue", "Cost", "Profit", "Margin"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {(data ?? []).length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No sales in this period.</td></tr>
            )}
            {(data ?? []).map((r) => (
              <tr key={r.product_id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium whitespace-nowrap">{r.product_brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.product_name}</td>
                <td className="px-3 py-2 font-medium">{r.units_sold}</td>
                <td className="px-3 py-2">₱{r.total_revenue.toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-500">₱{r.total_cost.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <Badge variant={r.total_profit >= 0 ? "green" : "red"}>₱{r.total_profit.toFixed(2)}</Badge>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={r.margin_pct >= 30 ? "green" : r.margin_pct >= 15 ? "yellow" : "red"}>{r.margin_pct.toFixed(1)}%</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
