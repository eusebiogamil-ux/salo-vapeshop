import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useInventorySummary } from "../../hooks/useReports";
import { inventoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#475569" }}>{children}</th>
);

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();
  if (isLoading) return <Spinner className="w-6 h-6 mx-auto my-8" />;

  const totalValue = data?.reduce((sum, r) => sum + r.stock_value, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Total stock value: <strong className="text-emerald-400 font-bold">₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong></p>
        <Button size="sm" variant="secondary" onClick={() => window.open(inventoryCsvUrl(), "_blank")}>Export CSV</Button>
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1e293b" }}>
        <table className="min-w-full text-sm">
          <thead style={{ background: "#0d1424" }}>
            <tr><TH>Brand</TH><TH>Product</TH><TH>Nic</TH><TH>Size</TH><TH>Price</TH><TH>Stock</TH><TH>Stock Value</TH><TH>Cost Value</TH><TH>Margin</TH></tr>
          </thead>
          <tbody style={{ background: "#0a0e1a" }}>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: "#1a2234" }}>
                <td className="px-4 py-3 font-bold text-slate-200 whitespace-nowrap">{r.brand}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {r.name}{r.is_low_stock && <Badge variant="red" className="ml-2">Low</Badge>}
                </td>
                <td className="px-4 py-3 text-slate-500">{r.nicotine_strength || "—"}</td>
                <td className="px-4 py-3 text-slate-500">{r.size || "—"}</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">₱{r.price.toFixed(2)}</td>
                <td className="px-4 py-3 font-bold text-slate-200">{r.stock_quantity}</td>
                <td className="px-4 py-3 text-slate-300">₱{r.stock_value.toFixed(2)}</td>
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
  );
}
