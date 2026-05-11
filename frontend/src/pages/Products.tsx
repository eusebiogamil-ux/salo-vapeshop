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
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1a1f36" }}>Products</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a3acb9" }}>{products.length} item{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="text-sm px-3.5 py-1.5 rounded-lg font-medium transition-colors"
          style={{ background: "#635bff", color: "#ffffff", boxShadow: "0 1px 2px rgba(99,91,255,0.3)" }}>
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
