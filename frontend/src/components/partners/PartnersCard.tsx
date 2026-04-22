import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

const avatarGradients = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-500",
];

function EditCapitalModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const [value, setValue] = useState(String(partner.capital));
  const update = useUpdateCapital();

  const handleSave = async () => {
    await update.mutateAsync({ id: partner.id, capital: Number(value) });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Edit Capital — ${partner.name}`}>
      <div className="space-y-4">
        <Input
          label="Capital Amount (₱)"
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Partners</h2>
          <p className="text-xs text-gray-400 mt-0.5">Capital contributions & equal profit share</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total Capital</p>
          <p className="text-sm font-bold text-gray-800">₱{totalCapital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="px-5 py-3 bg-indigo-50/50 border-b border-indigo-100/50 flex items-center justify-between">
        <span className="text-xs text-indigo-600 font-medium">Total Business Profit</span>
        <span className={`text-sm font-bold ${totalProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          ₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Partners list */}
      <div className="divide-y divide-gray-50">
        {partners.map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
              {p.name[0]}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-400">Equal profit share</p>
            </div>

            {/* Capital */}
            <div className="text-right px-3">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Capital</p>
              <p className="text-sm font-semibold text-gray-700">₱{p.capital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
            </div>

            {/* Profit Share */}
            <div className="text-right px-3">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Profit Share</p>
              <p className={`text-sm font-bold ${fairShare >= 0 ? "text-emerald-600" : "text-red-500"}`}>
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
