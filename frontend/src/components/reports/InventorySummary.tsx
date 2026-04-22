import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useInventorySummary } from "../../hooks/useReports";
import { inventoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();
  if (isLoading) return <Spinner className="w-5 h-5 mx-auto my-6" />;

  const totalValue = data?.reduce((sum, r) => sum + r.stock_value, 0) ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Total stock value: <strong className="text-gray-800">₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(inventoryCsvUrl(), "_blank")}>Export CSV</Button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Brand","Product","Nic","Size","Price","Stock","Stock Value","Cost Value","Margin"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r, i) => (
                <tr key={r.id} className={`hover:bg-gray-50 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-800 whitespace-nowrap">{r.brand}</td>
                  <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                    {r.name}{r.is_low_stock && <Badge variant="red" className="ml-1.5">Low</Badge>}
                  </td>
                  <td className="px-4 py-2.5 text-gray-400">{r.nicotine_strength || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-400">{r.size || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-700">₱{r.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{r.stock_quantity}</td>
                  <td className="px-4 py-2.5 text-gray-700">₱{r.stock_value.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-gray-400">₱{r.cost_value.toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={r.margin_pct >= 30 ? "green" : r.margin_pct >= 15 ? "yellow" : "red"}>{r.margin_pct.toFixed(1)}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
