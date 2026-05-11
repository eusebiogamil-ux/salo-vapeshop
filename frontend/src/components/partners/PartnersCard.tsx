import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e3e8ef",
  boxShadow: "0 1px 3px rgba(10,37,64,0.05)",
};

function EditCapitalModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const [value, setValue] = useState(String(partner.capital));
  const update = useUpdateCapital();
  return (
    <Modal open onClose={onClose} title={`Edit Capital — ${partner.name}`}>
      <div className="space-y-4">
        <Input label="Capital (₱)" type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={update.isPending} onClick={async () => { await update.mutateAsync({ id: partner.id, capital: Number(value) }); onClose(); }}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

export function PartnersCard() {
  const { data: partners = [], isLoading } = usePartners();
  const [editing, setEditing] = useState<Partner | null>(null);

  if (isLoading) return <Spinner className="w-5 h-5" />;

  const totalCapital = partners.reduce((s, p) => s + p.capital, 0);
  const totalProfit = partners.reduce((s, p) => s + p.total_profit, 0);
  const fairShare = partners.length > 0 ? totalProfit / partners.length : 0;

  return (
    <div style={card} className="overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f0f4f8" }}>
        <p className="text-sm font-semibold" style={{ color: "#1a1f36" }}>Partners</p>
        <span className="text-xs" style={{ color: "#a3acb9" }}>
          Total profit:{" "}
          <strong className={totalProfit >= 0 ? "text-emerald-700" : "text-red-600"}>
            ₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </strong>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f4f8" }}>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#697386" }}>Partner</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#697386" }}>Capital</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#697386" }}>Profit Share</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p, i) => (
              <tr key={p.id} className="hover:bg-[#f6f9fc] transition-colors" style={i > 0 ? { borderTop: "1px solid #f0f4f8" } : {}}>
                <td className="px-5 py-3 font-medium" style={{ color: "#1a1f36" }}>{p.name}</td>
                <td className="px-5 py-3 text-right tabular-nums" style={{ color: "#697386" }}>₱{p.capital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                <td className={`px-5 py-3 text-right font-semibold tabular-nums ${fairShare >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  ₱{fairShare.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Edit</Button>
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: "1px solid #e3e8ef", background: "#f6f9fc" }}>
              <td className="px-5 py-2.5 text-xs font-semibold" style={{ color: "#697386" }}>Total</td>
              <td className="px-5 py-2.5 text-right text-xs font-semibold tabular-nums" style={{ color: "#1a1f36" }}>₱{totalCapital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>
      {editing && <EditCapitalModal partner={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
