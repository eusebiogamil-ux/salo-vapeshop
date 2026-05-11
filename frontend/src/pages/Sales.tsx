import { useState } from "react";
import { Spinner } from "../components/ui/Spinner";
import { SaleForm } from "../components/sales/SaleForm";
import { SalesTable } from "../components/sales/SalesTable";
import { useSales } from "../hooks/useSales";

export default function Sales() {
  const { data: sales = [], isLoading } = useSales();
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a1f36" }}>Sales</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>{sales.length} transaction{sales.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="text-sm px-3.5 py-1.5 rounded-lg font-medium transition-colors"
          style={{ background: "#635bff", color: "#ffffff", boxShadow: "0 1px 2px rgba(99,91,255,0.3)" }}>
          + Record Sale
        </button>
      </div>

      {isLoading ? <Spinner className="w-6 h-6 mx-auto mt-16" /> : <SalesTable sales={sales} />}
      <SaleForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
