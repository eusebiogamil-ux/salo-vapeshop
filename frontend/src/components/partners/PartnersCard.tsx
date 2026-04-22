import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

const avatarGradients = ["from-indigo-500 to-violet-600", "from-violet-500 to-purple-700", "from-cyan-500 to-blue-600"];

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
    <div className="rounded-2xl border overflow-hidden" style={{ background: "#0a0e1a", borderColor: "#1e293b" }}>
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#1e293b", background: "#0d1424" }}>
        <div>
          <h2 className="text-base font-bold text-slate-100">Partners</h2>
          <p className="text-xs text-slate-500 mt-0.5">Equal profit share from all sales</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total Capital</p>
          <p className="text-base font-black text-slate-200">₱{totalCapital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: "#1e293b", background: "#0f1929" }}>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Total Business Profit</span>
        <span className={`text-base font-black ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          ₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="divide-y" style={{ divideColor: "#1a2234" }}>
        {partners.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-4 md:px-6 py-4 transition-colors hover:bg-white/[0.02]" style={{ borderColor: "#1a2234", borderTopWidth: i > 0 ? 1 : 0 }}>
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg`}>
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200">{p.name}</p>
              <p className="text-xs text-slate-600">Equal share</p>
            </div>
            <div className="text-right px-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Capital</p>
              <p className="text-xs md:text-sm font-bold text-slate-300">₱{p.capital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right px-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Profit Share</p>
              <p className={`text-xs md:text-sm font-black ${fairShare >= 0 ? "text-emerald-400" : "text-red-400"}`}>
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
