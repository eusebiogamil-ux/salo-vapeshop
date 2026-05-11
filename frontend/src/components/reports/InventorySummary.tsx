import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useInventorySummary } from "../../hooks/useReports";
import { inventoryCsvUrl } from "../../api/reports";
import { Spinner } from "../ui/Spinner";

const card = {
  background: "#fff",
  border: "1px solid #e3e8ef",
  borderRadius: "16px",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();
  if (isLoading) return <Spinner className="w-5 h-5 mx-auto my-6" />;

  const totalValue = data?.reduce((sum, r) => sum + r.stock_value, 0) ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#a3acb9" }}>
          Total stock value at sell price:{" "}
          <strong className="tabular-nums" style={{ color: "#1a1f36" }}>₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong>
        </p>
        <Button size="sm" variant="secondary" onClick={() => window.open(inventoryCsvUrl(), "_blank")}>Export CSV</Button>
      </div>
      <div style={card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                {["Brand", "Product", "Nic", "Size", "Price", "Stock", "Stock Value", "Cost Value", "Margin"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r, i) => (
                <tr key={r.id} className="hover:bg-[#f6f9fc] transition-colors" style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#1a1f36" }}>{r.brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#697386" }}>
                    {r.name}{r.is_low_stock && <Badge variant="red" className="ml-2">Low</Badge>}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#a3acb9" }}>{r.nicotine_strength || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "#a3acb9" }}>{r.size || "—"}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>₱{r.price.toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: "#1a1f36" }}>{r.stock_quantity}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>₱{r.stock_value.toFixed(2)}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#a3acb9" }}>₱{r.cost_value.toFixed(2)}</td>
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
