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
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setAddOpen(true)}>+ Add Product</Button>
      </div>

      <LowStockBanner products={products} />

      {isLoading ? (
        <Spinner className="w-8 h-8 mx-auto mt-16" />
      ) : (
        <ProductTable products={products} onLogSale={(p) => setSaleProduct(p)} />
      )}

      <ProductForm open={addOpen} onClose={() => setAddOpen(false)} />
      <SaleForm open={!!saleProduct} onClose={() => setSaleProduct(null)} product={saleProduct} />
    </div>
  );
}
