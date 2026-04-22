import { useState } from "react";
import { Spinner } from "../components/ui/Spinner";
import { LowStockBanner } from "../components/products/LowStockBanner";
import { ProductForm } from "../components/products/ProductForm";
import { ProductTable } from "../components/products/ProductTable";
import { SaleForm } from "../components/sales/SaleForm";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../api/products";

export default function Products() {
  const { data: products = [], isLoading } = useProducts();
  const [addOpen, setAddOpen] = useState(false);
  const [saleProduct, setSaleProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} product{products.length !== 1 ? "s" : ""} in inventory</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <LowStockBanner products={products} />

      {isLoading
        ? <Spinner className="w-8 h-8 mx-auto mt-16" />
        : <ProductTable products={products} onLogSale={(p) => setSaleProduct(p)} />
      }

      <ProductForm open={addOpen} onClose={() => setAddOpen(false)} />
      <SaleForm open={!!saleProduct} onClose={() => setSaleProduct(null)} product={saleProduct} />
    </div>
  );
}
