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
    <div className="max-w-7xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} item{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          + Add Product
        </button>
      </div>

      <LowStockBanner products={products} />

      {isLoading ? <Spinner className="w-6 h-6 mx-auto mt-16" /> : <ProductTable products={products} onLogSale={(p) => setSaleProduct(p)} />}

      <ProductForm open={addOpen} onClose={() => setAddOpen(false)} />
      <SaleForm open={!!saleProduct} onClose={() => setSaleProduct(null)} product={saleProduct} />
    </div>
  );
}
