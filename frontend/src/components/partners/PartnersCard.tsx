import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

const avatarColors = ["bg-indigo-600", "bg-violet-600", "bg-cyan-600"];

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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Partners</h2>
        <span className="text-xs text-gray-400">Total Capital: <strong className="text-gray-700">₱{totalCapital.toFixed(2)}</strong></span>
      </div>
      <div className="space-y-4">
        {partners.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-400">Equal profit share</p>
            </div>
            <div className="text-right mr-2">
              <p className="text-xs text-gray-400">Capital</p>
              <p className="text-sm font-bold text-gray-700">₱{p.capital.toFixed(2)}</p>
            </div>
            <div className="text-right mr-2">
              <p className="text-xs text-gray-400">Profit Share</p>
              <p className={`text-sm font-bold ${fairShare >= 0 ? "text-green-600" : "text-red-500"}`}>
                ₱{fairShare.toFixed(2)}
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Edit Capital</Button>
          </div>
        ))}
      </div>
      {editing && <EditCapitalModal partner={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
