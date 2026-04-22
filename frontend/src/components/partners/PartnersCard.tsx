import { useState } from "react";
import { usePartners, useUpdateCapital } from "../../hooks/usePartners";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import type { Partner } from "../../api/partners";

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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Partners</p>
        <span className="text-xs text-gray-400">
          Total profit: <strong className={`${totalProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
            ₱{totalProfit.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </strong>
        </span>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="px-5 py-2 text-left text-xs font-semibold text-gray-400">Partner</th>
            <th className="px-5 py-2 text-right text-xs font-semibold text-gray-400">Capital</th>
            <th className="px-5 py-2 text-right text-xs font-semibold text-gray-400">Profit Share</th>
            <th className="px-5 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p, i) => (
            <tr key={p.id} className={`${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50`}>
              <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
              <td className="px-5 py-3 text-right text-gray-600">₱{p.capital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              <td className={`px-5 py-3 text-right font-semibold ${fairShare >= 0 ? "text-green-700" : "text-red-600"}`}>
                ₱{fairShare.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right">
                <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Edit</Button>
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-100 bg-gray-50">
            <td className="px-5 py-2 text-xs font-semibold text-gray-500">Total</td>
            <td className="px-5 py-2 text-right text-xs font-semibold text-gray-600">₱{totalCapital.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
      {editing && <EditCapitalModal partner={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
