import { useState } from "react";
import { Spinner } from "../components/ui/Spinner";
import { SaleForm } from "../components/sales/SaleForm";
import { SalesTable } from "../components/sales/SalesTable";
import { useSales } from "../hooks/useSales";

export default function Sales() {
  const { data: sales = [], isLoading } = useSales();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales</h1>
          <p className="text-sm text-slate-500 mt-0.5">{sales.length} transaction{sales.length !== 1 ? "s" : ""} recorded</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Sale
        </button>
      </div>

      {isLoading
        ? <Spinner className="w-8 h-8 mx-auto mt-16" />
        : <SalesTable sales={sales} />
      }

      <SaleForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
