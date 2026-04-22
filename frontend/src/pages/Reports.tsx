import { useState } from "react";
import { Input } from "../components/ui/Input";
import { InventorySummary } from "../components/reports/InventorySummary";
import { SalesHistory } from "../components/reports/SalesHistory";

export default function Reports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Inventory and sales insights</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-200">Inventory Summary</h2>
        <InventorySummary />
      </section>

      <section className="space-y-3">
        <div className="flex items-end gap-4">
          <h2 className="text-xl font-bold text-slate-200">Sales History</h2>
          <div className="flex items-end gap-2 ml-auto">
            <Input
              label="From"
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-xs"
            />
            <Input
              label="To"
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
        <SalesHistory
          fromDate={fromDate ? new Date(fromDate).toISOString() : undefined}
          toDate={toDate ? new Date(toDate).toISOString() : undefined}
        />
      </section>
    </div>
  );
}
