import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { AdminFooter } from '../components/PageFooters';
import StatsGrid, { type AdminStat } from '../components/admin/StatsGrid';
import SearchableHeader from '../components/admin/SearchableHeader';
import OrdersTable from '../components/orders/OrdersTable';
import OrderEditPanel from '../components/orders/OrderEditPanel';
import RecentActivity from '../components/orders/RecentActivity';
import QuickFiltersPanel from '../components/orders/QuickFiltersPanel';
import { STATUS_FILTERS, type Order, type OrderStatus } from '../components/orders/ordersData';
import { API_BASE, authHeader, useAuth } from '../context/AuthContext';
import './OrdersPage.css';

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

function buildStatTiles(orders: Order[]): AdminStat[] {
  const active = orders.filter((o) => o.status === 'pending' || o.status === 'approved').length;
  const pending = orders.filter((o) => o.status === 'pending').length;

  const weekAgo = Date.now() - 7 * 86400000;
  const revenueThisWeek = orders
    .filter((o) => o.status !== 'cancelled' && o.createdAt && new Date(o.createdAt).getTime() >= weekAgo)
    .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

  return [
    { label: 'סה"כ הזמנות', value: orders.length.toLocaleString('he-IL'), sub: 'מאז ומתמיד', subClass: 'primary' },
    { label: 'הזמנות פעילות', value: active.toLocaleString('he-IL'), sub: 'בטיפול', subClass: 'secondary' },
    { label: 'ממתינות לאישור', value: pending.toLocaleString('he-IL'), sub: 'דורש פעולה', subClass: 'tertiary' },
    { label: 'הכנסות השבוע', value: `₪${revenueThisWeek.toLocaleString('he-IL')}`, sub: '7 הימים האחרונים', subClass: 'muted' },
  ];
}

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: authHeader(token) });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'טעינת ההזמנות נכשלה'));
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת ההזמנות נכשלה');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.company.toLowerCase().includes(q)
      );
    });
  }, [search, statusFilter, orders]);

  const handleSaveOrder = async (
    mongoId: string,
    input: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      company: string;
      totalPrice: number;
      status: Order['status'];
      notes: string;
    },
  ) => {
    const res = await fetch(`${API_BASE}/orders/${mongoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader(token) },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await extractErrorMessage(res, 'עדכון ההזמנה נכשל'));
    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o.mongoId === mongoId ? data.order : o)));
  };

  const handleDelete = async (order: Order) => {
    const confirmed = window.confirm(`למחוק את ההזמנה ${order.id}?`);
    if (!confirmed) return;

    setDeletingId(order.mongoId);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/orders/${order.mongoId}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'מחיקת ההזמנה נכשלה'));
      setOrders((prev) => prev.filter((o) => o.mongoId !== order.mongoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'מחיקת ההזמנה נכשלה');
    } finally {
      setDeletingId(null);
    }
  };

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
            filterOptions={STATUS_FILTERS}
            activeFilter={statusFilter}
            onFilterChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          />

          {!loading && <StatsGrid stats={buildStatTiles(orders)} />}

          {error && <p className="admin-error">{error}</p>}

          {loading ? (
            <div className="orders-table-card">
              <p className="admin-loading-row">טוען הזמנות...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-table-card">
              <p className="admin-empty-row">אין עדיין הזמנות במערכת</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="orders-table-card">
              <p className="admin-empty-row">אין הזמנות התואמות לסינון הנוכחי</p>
            </div>
          ) : (
            <OrdersTable
              orders={filtered}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId((v) => (v === id ? null : id))}
              onEdit={setEditingOrder}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}

          <div className="orders-bottom">
            <RecentActivity orders={orders} />
            <QuickFiltersPanel activeFilter={statusFilter} onFilterChange={setStatusFilter} exportOrders={filtered} />
          </div>

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console v2.4.0" />
        </div>
      </main>

      <OrderEditPanel order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleSaveOrder} />
    </div>
  );
}
