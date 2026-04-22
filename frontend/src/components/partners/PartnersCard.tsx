import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

const avatarColors = ["bg-indigo-500", "bg-violet-500", "bg-cyan-500", "bg-emerald-500"];

function EditCapitalModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const [value, setValue] = useState(String(partner.capital));
  const update = useUpdateCapital();
  const handleSave = async () => { await update.mutateAsync({ id: partner.id, capital: Number(value) }); onClose(); };
  return (
    <Modal open onClose={onClose} title={`Edit Capital — ${partner.name}`}>
      <div className="space-y-4">
        <Input label="Capital Amount (₱)" type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={update.isPending} onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

export function PartnersCard() {
  const { data: partners = [], isLoading } = usePartners();
  const [editing, setEditing] = useState<Partner | null>(null);

  if (isLoading) return <Spinner className="w-6 h-6" />;

  const totalCapital = partners.reduce((s, p) => s + p.capital, 0);
  const totalProfit = partners.reduce((s, p) => s + p.total_profit, 0);
  const fairShare = partners.length > 0 ? totalProfit / partners.length : 0;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Partners</h2>
          <p className="text-xs text-slate-500 mt-0.5">Equal profit share from all sales</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Total Capital</p>
          <p className="text-base font-black text-slate-800">₱{totalCapital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Business Profit</span>
        <span className={`text-base font-black ${totalProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
          ₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div>
        {partners.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}>
            <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-black text-sm shrink-0`}>
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-400">Equal share</p>
            </div>
            <div className="text-right px-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Capital</p>
              <p className="text-sm font-bold text-slate-700">₱{p.capital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right px-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Profit Share</p>
              <p className={`text-sm font-black ${fairShare >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                ₱{fairShare.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Edit</Button>
          </div>
        ))}
      </div>
      {editing && <EditCapitalModal partner={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
