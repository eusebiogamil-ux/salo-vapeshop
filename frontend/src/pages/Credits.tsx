import { useState } from "react";
import { useCredits, useCreateCredit, useRecordPayment, useSettleCredit, useDeleteCredit } from "../hooks/useCredits";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import type { Credit } from "../api/credits";

const card = {
  background: "#fff",
  border: "1px solid #e3e8ef",
  borderRadius: "16px",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

function AddCreditModal({ onClose }: { onClose: () => void }) {
  const create = useCreateCredit();
  const [form, setForm] = useState({ customer_name: "", amount: "", description: "", due_date: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({
      customer_name: form.customer_name,
      amount: Number(form.amount),
      description: form.description || undefined,
      due_date: form.due_date || undefined,
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Add Utang / Receivable">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Customer Name *" value={form.customer_name} onChange={e => set("customer_name", e.target.value)} required placeholder="e.g. Juan dela Cruz" />
        <Input label="Amount (₱) *" type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set("amount", e.target.value)} required placeholder="0.00" />
        <Input label="Description" value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. 2 pods, 1 bottle" />
        <Input label="Due Date" type="date" value={form.due_date} onChange={e => set("due_date", e.target.value)} />
        {create.error && <p className="text-xs text-red-600">{(create.error as any).response?.data?.detail ?? "Error"}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={create.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}

function PayModal({ credit, onClose }: { credit: Credit; onClose: () => void }) {
  const pay = useRecordPayment();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await pay.mutateAsync({ id: credit.id, amount: Number(amount) });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Record Payment — ${credit.customer_name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl px-4 py-3 text-sm space-y-2" style={{ background: "#f6f9fc", border: "1px solid #e3e8ef" }}>
          <div className="flex justify-between">
            <span style={{ color: "#697386" }}>Total owed</span>
            <span className="font-semibold tabular-nums" style={{ color: "#1a1f36" }}>₱{credit.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#697386" }}>Already paid</span>
            <span className="font-semibold text-emerald-700 tabular-nums">₱{credit.amount_paid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #e3e8ef" }}>
            <span className="font-medium" style={{ color: "#1a1f36" }}>Balance</span>
            <span className="font-bold text-red-600 tabular-nums">₱{credit.balance.toFixed(2)}</span>
          </div>
        </div>
        <Input label="Payment Amount (₱) *" type="number" min="0.01" step="0.01" max={credit.balance}
          value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={pay.isPending}>Record Payment</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Credits() {
  const [showSettled, setShowSettled] = useState(false);
  const { data: credits = [], isLoading } = useCredits(showSettled ? undefined : false);
  const settle = useSettleCredit();
  const del = useDeleteCredit();
  const [addOpen, setAddOpen] = useState(false);
  const [paying, setPaying] = useState<Credit | null>(null);

  const totalOutstanding = credits.filter(c => !c.is_settled).reduce((s, c) => s + c.balance, 0);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a1f36" }}>Utang / Receivables</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>Track unpaid balances from customers</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="text-sm px-3.5 py-1.5 rounded-xl font-medium transition-colors"
          style={{ background: "#635bff", color: "#fff", boxShadow: "0 1px 2px rgba(99,91,255,0.3)" }}>
          + Add Utang
        </button>
      </div>

      {totalOutstanding > 0 && (
        <div style={card} className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#a3acb9" }}>Total Outstanding</p>
            <p className="text-2xl font-bold text-red-500 tabular-nums">₱{totalOutstanding.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
          </div>
          <p className="text-sm" style={{ color: "#a3acb9" }}>{credits.filter(c => !c.is_settled).length} unpaid</p>
        </div>
      )}

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#f0f3f7", border: "1px solid #e3e8ef" }}>
        {[{ label: "Unpaid", val: false }, { label: "All", val: true }].map(({ label, val }) => (
          <button
            key={label}
            onClick={() => setShowSettled(val)}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={showSettled === val
              ? { background: "#fff", color: "#1a1f36", boxShadow: "0 1px 3px rgba(10,37,64,0.1)" }
              : { color: "#697386" }}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <Spinner className="w-6 h-6 mx-auto mt-10" /> : (
        <div style={card} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #e3e8ef", background: "#f6f9fc" }}>
                  {["Customer", "Amount", "Paid", "Balance", "Description", "Due Date", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#697386" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {credits.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#a3acb9" }}>No records yet.</td></tr>
                )}
                {credits.map((c, i) => (
                  <tr key={c.id}
                    className="hover:bg-[#f6f9fc] transition-colors"
                    style={{ ...(i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}), ...(c.is_settled ? { opacity: 0.5 } : {}) }}>
                    <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "#1a1f36" }}>{c.customer_name}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: "#697386" }}>₱{c.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-emerald-700 tabular-nums">₱{c.amount_paid.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-red-500 tabular-nums">₱{c.balance.toFixed(2)}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-xs" style={{ color: "#a3acb9" }}>{c.description ?? "—"}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#a3acb9" }}>
                      {c.due_date ? new Date(c.due_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.is_settled ? "green" : "red"}>{c.is_settled ? "Paid" : "Unpaid"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        {!c.is_settled && (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => setPaying(c)}>Pay</Button>
                            <Button size="sm" variant="ghost" onClick={() => { if (confirm("Mark as fully paid?")) settle.mutate(c.id); }}>Settle</Button>
                          </>
                        )}
                        <Button size="sm" variant="danger" onClick={() => { if (confirm("Delete this record?")) del.mutate(c.id); }}>Del</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {addOpen && <AddCreditModal onClose={() => setAddOpen(false)} />}
      {paying && <PayModal credit={paying} onClose={() => setPaying(null)} />}
    </div>
  );
}
