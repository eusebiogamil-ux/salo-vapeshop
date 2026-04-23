import { useState } from "react";
import { useCredits, useCreateCredit, useRecordPayment, useSettleCredit, useDeleteCredit } from "../hooks/useCredits";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import type { Credit } from "../api/credits";

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
        <div className="bg-gray-50 border border-gray-200 rounded px-4 py-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Total owed</span>
            <span className="font-semibold text-gray-800">₱{credit.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Already paid</span>
            <span className="font-semibold text-green-700">₱{credit.amount_paid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
            <span className="text-gray-700 font-medium">Balance</span>
            <span className="font-bold text-red-600">₱{credit.balance.toFixed(2)}</span>
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
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Utang / Receivables</h1>
          <p className="text-xs text-gray-400 mt-0.5">Track unpaid balances from customers</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          + Add Utang
        </button>
      </div>

      {/* Summary */}
      {totalOutstanding > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Outstanding</p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">₱{totalOutstanding.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
          </div>
          <p className="text-sm text-gray-400">{credits.filter(c => !c.is_settled).length} unpaid</p>
        </div>
      )}

      {/* Filter toggle */}
      <div className="flex gap-2">
        <button onClick={() => setShowSettled(false)}
          className={`px-3 py-1 text-xs rounded font-medium border transition-colors ${!showSettled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
          Unpaid
        </button>
        <button onClick={() => setShowSettled(true)}
          className={`px-3 py-1 text-xs rounded font-medium border transition-colors ${showSettled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
          All
        </button>
      </div>

      {/* Table */}
      {isLoading ? <Spinner className="w-6 h-6 mx-auto mt-10" /> : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {["Customer", "Amount", "Paid", "Balance", "Description", "Due Date", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {credits.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No records yet.</td></tr>
                )}
                {credits.map((c, i) => (
                  <tr key={c.id} className={`${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50 ${c.is_settled ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{c.customer_name}</td>
                    <td className="px-4 py-3 text-gray-700">₱{c.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-green-700">₱{c.amount_paid.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">₱{c.balance.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate">{c.description ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
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
