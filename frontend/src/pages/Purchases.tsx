import { useState } from "react";
import { usePurchases, useVoidPurchase } from "../hooks/usePurchases";
import { BulkPurchaseForm } from "../components/purchases/BulkPurchaseForm";
import { PurchaseForm } from "../components/purchases/PurchaseForm";
import { Spinner } from "../components/ui/Spinner";
import type { Purchase } from "../api/purchases";

const card = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e3e8ef",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

function php(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Purchases() {
  const { data: purchases = [], isLoading } = usePurchases();
  const voidPurchase = useVoidPurchase();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Purchase | null>(null);

  const totalSpent = purchases.reduce((s, p) => s + p.total_cost, 0);

  return (
    <div className="max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a1f36" }}>Purchases</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>{purchases.length} record{purchases.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="text-sm px-3.5 py-1.5 rounded-xl font-medium transition-colors"
          style={{ background: "#635bff", color: "#fff", boxShadow: "0 1px 2px rgba(99,91,255,0.3)" }}
        >
          + New Purchase
        </button>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div style={card} className="px-5 py-4 rounded-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#a3acb9" }}>Total Spent</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "#1a1f36" }}>{php(totalSpent)}</p>
        </div>
        <div style={card} className="px-5 py-4 rounded-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#a3acb9" }}>Transactions</p>
          <p className="text-2xl font-bold" style={{ color: "#1a1f36" }}>{purchases.length}</p>
        </div>
        <div style={card} className="px-5 py-4 rounded-2xl col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#a3acb9" }}>Avg Purchase</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "#1a1f36" }}>
            {purchases.length > 0 ? php(totalSpent / purchases.length) : "—"}
          </p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Spinner className="w-6 h-6 mx-auto mt-16" />
      ) : (
        <div style={card} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                  {["Date", "Product", "Qty", "Unit Cost", "Shipping", "Total", "Notes", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-sm" style={{ color: "#a3acb9" }}>
                      No purchases recorded yet.
                    </td>
                  </tr>
                )}
                {purchases.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#f6f9fc] transition-colors"
                    style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}
                  >
                    <td className="px-4 py-3 text-xs tabular-nums whitespace-nowrap" style={{ color: "#a3acb9" }}>
                      {new Date(p.purchased_at).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.product_brand ? (
                        <>
                          <span className="font-medium" style={{ color: "#1a1f36" }}>{p.product_brand}</span>
                          <span className="ml-1" style={{ color: "#a3acb9" }}>— {p.product_name}</span>
                        </>
                      ) : (
                        <span style={{ color: "#697386" }}>{p.notes || "General"}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "#697386" }}>{p.quantity}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>{php(p.unit_cost)}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: "#a3acb9" }}>
                      {p.shipping_fee > 0 ? php(p.shipping_fee) : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: "#1a1f36" }}>{php(p.total_cost)}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-xs" style={{ color: "#a3acb9" }}>
                      {p.product_brand ? (p.notes ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditing(p)}
                          className="text-xs font-medium transition-colors px-2 py-1 rounded-md hover:bg-[#f0f4f8]"
                          style={{ color: "#697386" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this purchase?")) voidPurchase.mutate(p.id); }}
                          className="text-xs font-medium transition-colors px-2 py-1 rounded-md hover:bg-red-50 hover:text-red-500"
                          style={{ color: "#c2c8d0" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BulkPurchaseForm open={addOpen} onClose={() => setAddOpen(false)} />
      <PurchaseForm open={!!editing} purchase={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
