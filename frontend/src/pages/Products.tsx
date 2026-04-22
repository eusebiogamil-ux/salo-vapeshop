import { useState } from "react";
import { Button } from "../components/ui/Button";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-base text-gray-500 mt-1">{products.length} product{products.length !== 1 ? "s" : ""} in inventory</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Add Product</Button>
      </div>

      <LowStockBanner products={products} />

      {isLoading ? (
        <Spinner className="w-10 h-10 mx-auto mt-20" />
      ) : (
        <ProductTable products={products} onLogSale={(p) => setSaleProduct(p)} />
      )}

      <ProductForm open={addOpen} onClose={() => setAddOpen(false)} />
      <SaleForm open={!!saleProduct} onClose={() => setSaleProduct(null)} product={saleProduct} />
    </div>
  );
}
