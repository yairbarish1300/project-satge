import { useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AddProductPanel from '../components/AddProductPanel';
import { AdminFooter } from '../components/PageFooters';
import { useProductCatalog, type CatalogProduct } from '../context/ProductCatalogContext';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatsGrid from '../components/admin/StatsGrid';
import SearchableHeader from '../components/admin/SearchableHeader';
import InventoryTable from '../components/inventory/InventoryTable';
import { buildInventoryStats } from '../components/inventory/inventoryData';
import './InventoryPage.css';

export default function InventoryPage() {
  const { products, loading, error, deleteProduct } = useProductCatalog();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter((item) => item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q));
  }, [search, products]);

  const openEdit = (product: CatalogProduct) => {
    setEditingProduct(product);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (product: CatalogProduct) => {
    const confirmed = window.confirm(`למחוק את "${product.name}" מהמלאי לצמיתות?`);
    if (!confirmed) return;

    setDeletingId(product.id);
    setActionError('');
    try {
      await deleteProduct(product.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'מחיקת המוצר נכשלה');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar active="inventory" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader title="Inventory Management" description="Track and manage lighting, sound, and stage equipment in one place." />

          {!loading && <StatsGrid stats={buildInventoryStats(products)} />}

          <SearchableHeader
            title="Equipment List"
            description="Search equipment, review stock levels, and manage daily rates."
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search equipment ID, name..."
          />

          {(error || actionError) && <p className="admin-error">{error || actionError}</p>}

          {loading ? (
            <div className="orders-table-card">
              <p className="admin-loading-row">טוען מוצרים...</p>
            </div>
          ) : (
            <InventoryTable items={filtered} totalCount={products.length} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} />
          )}

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console" />
        </div>
      </main>

      <AddProductPanel open={isPanelOpen} onClose={closePanel} editingProduct={editingProduct} />
    </div>
  );
}
