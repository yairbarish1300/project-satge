import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useProductCatalog, type CatalogProduct } from '../context/ProductCatalogContext';
import { useCategoryTree } from '../context/CategoryTreeContext';
import CategorySidebar from '../components/shop/CategorySidebar';
import ProductGrid from '../components/shop/ProductGrid';
import ProductDetailPanel from '../components/shop/ProductDetailPanel';
import './ShopPage.css';

export default function ShopPage() {
  const navigate = useNavigate();
  const { products } = useProductCatalog();
  const { branches } = useCategoryTree();
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [selectedLeafIds, setSelectedLeafIds] = useState<string[]>([]);

  const allLeaves = useMemo(() => branches.flatMap((branch) => branch.leaves), [branches]);

  useEffect(() => {
    setSelectedLeafIds(allLeaves.map((leaf) => leaf.id));
  }, [allLeaves]);

  const onLeafToggle = (id: string) => {
    setSelectedLeafIds((prev) => (prev.includes(id) ? prev.filter((leafId) => leafId !== id) : [...prev, id]));
  };

  const selectedLeafNames = useMemo(
    () => allLeaves.filter((leaf) => selectedLeafIds.includes(leaf.id)).map((leaf) => leaf.name.toLowerCase()),
    [allLeaves, selectedLeafIds],
  );

  const filteredProducts = useMemo(() => {
    if (selectedLeafNames.length === 0) return products;

    return products.filter((product) => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const tags = product.tags.map((tag) => tag.toLowerCase());

      return selectedLeafNames.some((leafName) => name.includes(leafName) || category.includes(leafName) || tags.includes(leafName));
    });
  }, [products, selectedLeafNames]);

  return (
    <div className="rp-page">
      <Header currentPage="shop" showSearch={true} />

      <main className="rp-main shop-page">
        <section className="rp-shop-layout">
          <CategorySidebar branches={branches} selectedLeafIds={selectedLeafIds} onLeafToggle={onLeafToggle} />

          <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />

          {selectedProduct ? (
            <ProductDetailPanel
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onOrder={() => navigate(`/checkout?productId=${selectedProduct.id}`)}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}
