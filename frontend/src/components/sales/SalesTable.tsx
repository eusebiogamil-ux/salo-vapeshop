import { format } from "date-fns";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useVoidSale } from "../../hooks/useSales";
import type { Sale } from "../../api/sales";

export function SalesTable({ sales }: { sales: Sale[] }) {
  const voidSale = useVoidSale();

  const handleVoid = (s: Sale) => {
    if (confirm(`Void sale of ${s.quantity_sold}x ${s.product_name}? Stock will be restored.`)) {
      voidSale.mutate(s.id);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Date", "Product", "Qty", "Unit Price", "Revenue", "Profit", "By", "Notes", ""].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {sales.length === 0 && (
            <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No sales recorded yet.</td></tr>
          )}
          {sales.map((s) => {
            const profit = Number(s.total_revenue) - Number(s.total_cost);
            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-gray-500">{format(new Date(s.sold_at), "MMM d, yyyy HH:mm")}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="font-medium text-gray-900">{s.product_brand}</span>
                  <span className="text-gray-500 ml-1">— {s.product_name}</span>
                </td>
                <td className="px-3 py-2 text-gray-700">{s.quantity_sold}</td>
                <td className="px-3 py-2 text-gray-700">₱{Number(s.unit_price).toFixed(2)}</td>
                <td className="px-3 py-2 font-medium text-gray-900">₱{Number(s.total_revenue).toFixed(2)}</td>
                <td className="px-3 py-2">
                  <Badge variant={profit >= 0 ? "green" : "red"}>₱{profit.toFixed(2)}</Badge>
                </td>
                <td className="px-3 py-2 font-medium text-indigo-600 whitespace-nowrap">{(s as any).partner_name ?? "—"}</td>
                <td className="px-3 py-2 text-gray-400 max-w-[140px] truncate">{s.notes ?? "—"}</td>
                <td className="px-3 py-2">
                  <Button size="sm" variant="ghost" onClick={() => handleVoid(s)}>Void</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
