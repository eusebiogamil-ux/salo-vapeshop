import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useInventorySummary } from "../../hooks/useReports";
import { inventoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();

  if (isLoading) return <Spinner className="w-6 h-6 mx-auto my-8" />;

  const totalValue = data?.reduce((sum, r) => sum + r.stock_value, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Total stock value: <strong className="text-gray-900">₱{totalValue.toFixed(2)}</strong></p>
        <Button size="sm" variant="secondary" onClick={() => window.open(inventoryCsvUrl(), "_blank")}>Export CSV</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Brand", "Product", "Nic", "Size", "Price", "Stock", "Stock Value", "Cost Value", "Margin"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {(data ?? []).map((r) => (
              <tr key={r.id} className={r.is_low_stock ? "bg-red-50" : "hover:bg-gray-50"}>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{r.brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {r.name}
                  {r.is_low_stock && <Badge variant="red" className="ml-2">Low</Badge>}
                </td>
                <td className="px-3 py-2 text-gray-500">{r.nicotine_strength || "—"}</td>
                <td className="px-3 py-2 text-gray-500">{r.size || "—"}</td>
                <td className="px-3 py-2">₱{r.price.toFixed(2)}</td>
                <td className="px-3 py-2 font-medium">{r.stock_quantity}</td>
                <td className="px-3 py-2">₱{r.stock_value.toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-500">₱{r.cost_value.toFixed(2)}</td>
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
