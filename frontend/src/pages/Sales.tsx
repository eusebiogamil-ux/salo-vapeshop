import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { SaleForm } from "../components/sales/SaleForm";
import { SalesTable } from "../components/sales/SalesTable";
import { useSales } from "../hooks/useSales";

export default function Sales() {
  const { data: sales = [], isLoading } = useSales();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales</h1>
          <p className="text-base text-gray-500 mt-1">{sales.length} transaction{sales.length !== 1 ? "s" : ""} recorded</p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Record Sale</Button>
      </div>

      {isLoading ? (
        <Spinner className="w-10 h-10 mx-auto mt-20" />
      ) : (
        <SalesTable sales={sales} />
      )}

      <SaleForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
