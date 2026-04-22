import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useInventorySummary } from "../../hooks/useReports";
import { inventoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

const TH = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 whitespace-nowrap">{children}</th>
);

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();
  if (isLoading) return <Spinner className="w-6 h-6 mx-auto my-8" />;

  const totalValue = data?.reduce((sum, r) => sum + r.stock_value, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Stock value: <strong className="text-emerald-700">₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(inventoryCsvUrl(), "_blank")}>Export CSV</Button>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <TH>Brand</TH><TH>Product</TH><TH>Nic</TH><TH>Size</TH><TH>Price</TH><TH>Stock</TH><TH>Stock Value</TH><TH>Cost Value</TH><TH>Margin</TH>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r, i) => (
                <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.brand}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    {r.name}{r.is_low_stock && <Badge variant="red" className="ml-2">Low</Badge>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{r.nicotine_strength || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{r.size || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">₱{r.price.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{r.stock_quantity}</td>
                  <td className="px-4 py-3 text-slate-700">₱{r.stock_value.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500">₱{r.cost_value.toFixed(2)}</td>
                  <td className="px-4 py-3">
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
