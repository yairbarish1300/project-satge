import { useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { AdminFooter } from '../components/PageFooters';
import StatsGrid from '../components/admin/StatsGrid';
import SearchableHeader from '../components/admin/SearchableHeader';
import OrdersTable from '../components/orders/OrdersTable';
import RecentActivity from '../components/orders/RecentActivity';
import QuickFiltersPanel from '../components/orders/QuickFiltersPanel';
import { ORDERS, STATS } from '../components/orders/ordersData';
import './OrdersPage.css';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ORDERS;
    return ORDERS.filter((order) =>
      order.id.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.company.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="admin-shell">
      <AdminSidebar active="orders" />

      <main className="admin-main">
        <div className="admin-content">
          <SearchableHeader
            title="Order Management"
            description="Track rental orders, approvals, and fulfillment status."
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search order ID, customer..."
          />

          <StatsGrid stats={STATS} />

          <OrdersTable
            orders={filtered}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((v) => (v === id ? null : id))}
          />

          <div className="orders-bottom">
            <RecentActivity />
            <QuickFiltersPanel />
          </div>

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console v2.4.0" />
        </div>
      </main>
    </div>
  );
}
