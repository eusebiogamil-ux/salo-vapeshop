import { format } from "date-fns";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useVoidSale } from "../../hooks/useSales";
import type { Sale } from "../../api/sales";

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "#475569" }}>{children}</th>
);

export function SalesTable({ sales }: { sales: Sale[] }) {
  const voidSale = useVoidSale();

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1e293b" }}>
      <table className="min-w-full text-sm">
        <thead style={{ background: "#0d1424" }}>
          <tr>
            <TH>Date</TH><TH>Product</TH><TH>Qty</TH><TH>Unit Price</TH>
            <TH>Revenue</TH><TH>Profit</TH><TH>By</TH><TH>Notes</TH><TH></TH>
          </tr>
        </thead>
        <tbody style={{ background: "#0a0e1a" }}>
          {sales.length === 0 && (
            <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-600 text-base">No sales recorded yet.</td></tr>
          )}
          {sales.map((s) => {
            const profit = Number(s.total_revenue) - Number(s.total_cost);
            return (
              <tr key={s.id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: "#1a2234" }}>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">{format(new Date(s.sold_at), "MMM d, yyyy HH:mm")}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-bold text-slate-200">{s.product_brand}</span>
                  <span className="text-slate-500 ml-1">— {s.product_name}</span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-semibold">{s.quantity_sold}</td>
                <td className="px-4 py-3 text-slate-400">₱{Number(s.unit_price).toFixed(2)}</td>
                <td className="px-4 py-3 font-bold text-emerald-400">₱{Number(s.total_revenue).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={profit >= 0 ? "green" : "red"}>₱{profit.toFixed(2)}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-indigo-400 whitespace-nowrap">{(s as any).partner_name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate text-xs">{s.notes ?? "—"}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Void this sale?`)) voidSale.mutate(s.id); }}>Void</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
