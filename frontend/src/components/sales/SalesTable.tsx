import { format } from "date-fns";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useVoidSale } from "../../hooks/useSales";
import type { Sale } from "../../api/sales";

const TH = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap bg-slate-50">{children}</th>
);

export function SalesTable({ sales }: { sales: Sale[] }) {
  const voidSale = useVoidSale();

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <TH>Date</TH><TH>Product</TH><TH>Qty</TH><TH>Price</TH>
              <TH>Revenue</TH><TH>Profit</TH><TH>By</TH><TH>Notes</TH><TH></TH>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400">No sales recorded yet.</td></tr>
            )}
            {sales.map((s, i) => {
              const profit = Number(s.total_revenue) - Number(s.total_cost);
              return (
                <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">{format(new Date(s.sold_at), "MMM d, yy HH:mm")}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{s.product_brand}</span>
                    <span className="text-slate-400 ml-1 text-xs">— {s.product_name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{s.quantity_sold}</td>
                  <td className="px-4 py-3 text-slate-500">₱{Number(s.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">₱{Number(s.total_revenue).toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge variant={profit >= 0 ? "green" : "red"}>₱{profit.toFixed(2)}</Badge></td>
                  <td className="px-4 py-3 font-medium text-indigo-600 whitespace-nowrap text-xs">{(s as any).partner_name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-[100px] truncate text-xs">{s.notes ?? "—"}</td>
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
