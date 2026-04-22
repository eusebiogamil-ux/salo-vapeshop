import { format } from "date-fns";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useVoidSale } from "../../hooks/useSales";
import type { Sale } from "../../api/sales";

export function SalesTable({ sales }: { sales: Sale[] }) {
  const voidSale = useVoidSale();
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr>
              {["Date","Product","Qty","Price","Revenue","Profit","By","Notes",""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No sales recorded yet.</td></tr>
            )}
            {sales.map((s, i) => {
              const profit = Number(s.total_revenue) - Number(s.total_cost);
              return (
                <tr key={s.id} className={`hover:bg-gray-50 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <td className="px-4 py-2.5 text-gray-400 text-xs whitespace-nowrap">{format(new Date(s.sold_at), "MMM d, yy HH:mm")}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="font-medium text-gray-800">{s.product_brand}</span>
                    <span className="text-gray-400 ml-1">— {s.product_name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-700">{s.quantity_sold}</td>
                  <td className="px-4 py-2.5 text-gray-500">₱{Number(s.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">₱{Number(s.total_revenue).toFixed(2)}</td>
                  <td className="px-4 py-2.5"><Badge variant={profit >= 0 ? "green" : "red"}>₱{profit.toFixed(2)}</Badge></td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{(s as any).partner_name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs max-w-[100px] truncate">{s.notes ?? "—"}</td>
                  <td className="px-4 py-2.5">
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
