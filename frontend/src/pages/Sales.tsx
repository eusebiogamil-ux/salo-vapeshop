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
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <Button onClick={() => setOpen(true)}>+ Record Sale</Button>
      </div>

      {isLoading ? (
        <Spinner className="w-8 h-8 mx-auto mt-16" />
      ) : (
        <SalesTable sales={sales} />
      )}

      <SaleForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
