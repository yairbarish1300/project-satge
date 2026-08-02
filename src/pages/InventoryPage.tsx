import { useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { AdminFooter } from '../components/PageFooters';
import { useProductCatalog } from '../context/ProductCatalogContext';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatsGrid from '../components/admin/StatsGrid';
import SearchableHeader from '../components/admin/SearchableHeader';
import InventoryTable from '../components/inventory/InventoryTable';
import { BASE_ITEMS, STATS, type InventoryItem } from '../components/inventory/inventoryData';
import './InventoryPage.css';

export default function InventoryPage() {
  const { products } = useProductCatalog();
  const [search, setSearch] = useState('');

  const combinedItems = useMemo<InventoryItem[]>(() => {
    const fromProducts: InventoryItem[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: `${product.stockAvailable}/${product.stockTotal}`,
      dayRate: `₪${product.price.toLocaleString('he-IL')}`,
      status: product.stockAvailable <= 3 ? 'low-stock' : product.stockAvailable === 0 ? 'in-use' : 'available',
    }));

    return [...BASE_ITEMS, ...fromProducts];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return combinedItems;
    return combinedItems.filter((item) => item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q));
  }, [search, combinedItems]);

  return (
    <div className="admin-shell">
      <AdminSidebar active="inventory" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader title="Inventory Management" description="Track and manage lighting, sound, and stage equipment in one place." />

          <StatsGrid stats={STATS} />

          <SearchableHeader
            title="Equipment List"
            description="Search equipment, review stock levels, and manage daily rates."
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search equipment ID, name..."
          />

          <InventoryTable items={filtered} totalCount={combinedItems.length} />

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console" />
        </div>
      </main>
    </div>
  );
}
