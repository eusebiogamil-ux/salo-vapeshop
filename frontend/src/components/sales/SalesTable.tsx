import { format } from "date-fns";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useVoidSale, useMarkCollected } from "../../hooks/useSales";
import type { Sale } from "../../api/sales";

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e3e8ef",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

export function SalesTable({ sales }: { sales: Sale[] }) {
  const voidSale = useVoidSale();
  const markCollected = useMarkCollected();

  return (
    <div style={card} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
              {["Date", "Product", "Qty", "Price", "Revenue", "Profit", "By", "Status", "Notes", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-sm" style={{ color: "#a3acb9" }}>No sales recorded yet.</td></tr>
            )}
            {sales.map((s, i) => {
              const profit = Number(s.total_revenue) - Number(s.total_cost);
              return (
                <tr key={s.id}
                  className="hover:bg-[#f6f9fc] transition-colors"
                  style={{
                    ...(i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}),
                    ...(!s.cash_collected ? { background: "#fffbeb" } : {}),
                  }}>
                  <td className="px-4 py-3 text-xs whitespace-nowrap tabular-nums" style={{ color: "#a3acb9" }}>{format(new Date(s.sold_at), "MMM d, yy HH:mm")}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium" style={{ color: "#1a1f36" }}>{s.product_brand}</span>
                    <span className="ml-1" style={{ color: "#a3acb9" }}>— {s.product_name}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#697386" }}>{s.quantity_sold}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>₱{Number(s.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium tabular-nums" style={{ color: "#1a1f36" }}>₱{Number(s.total_revenue).toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge variant={profit >= 0 ? "green" : "red"}>₱{profit.toFixed(2)}</Badge></td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#a3acb9" }}>{s.partner_name ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {s.cash_collected ? (
                      <Badge variant="green">Collected</Badge>
                    ) : (
                      <button
                        onClick={() => markCollected.mutate(s.id)}
                        disabled={markCollected.isPending}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Uncollected · Mark paid
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs max-w-[100px] truncate" style={{ color: "#a3acb9" }}>{s.notes ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("Void this sale?")) voidSale.mutate(s.id); }}>Void</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
