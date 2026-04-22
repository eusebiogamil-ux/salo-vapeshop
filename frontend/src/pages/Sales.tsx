import { useState } from "react";
import { Spinner } from "../components/ui/Spinner";
import { SaleForm } from "../components/sales/SaleForm";
import { SalesTable } from "../components/sales/SalesTable";
import { useSales } from "../hooks/useSales";

export default function Sales() {
  const { data: sales = [], isLoading } = useSales();
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales</h1>
          <p className="text-xs text-gray-400 mt-0.5">{sales.length} transaction{sales.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          + Record Sale
        </button>
      </div>

      {isLoading ? <Spinner className="w-6 h-6 mx-auto mt-16" /> : <SalesTable sales={sales} />}
      <SaleForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
