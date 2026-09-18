import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AddProductPanel from '../components/AddProductPanel';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatsGrid, { type AdminStat } from '../components/admin/StatsGrid';
import DashboardActionsGrid from '../components/dashboard/DashboardActionsGrid';
import QuickActionsGrid from '../components/dashboard/QuickActionsGrid';
import CategoryManager from '../components/dashboard/CategoryManager';
import { AdminFooter } from '../components/PageFooters';
import { API_BASE, authHeader, useAuth } from '../context/AuthContext';
import './DashboardPage.css';

interface DashboardStats {
  productCount: number;
  activeOrdersCount: number;
  pendingOrdersCount: number;
  revenueThisMonth: number;
  monthOrdersCount: number;
}

function buildStatTiles(stats: DashboardStats): AdminStat[] {
  return [
    {
      label: 'מוצרים בקטלוג',
      value: stats.productCount.toLocaleString('he-IL'),
      sub: 'סה"כ מוצרים פעילים',
      subClass: 'primary',
    },
    {
      label: 'הזמנות פעילות',
      value: stats.activeOrdersCount.toLocaleString('he-IL'),
      sub: 'ממתינות לטיפול',
      subClass: 'secondary',
    },
    {
      label: 'ממתינות לאישור',
      value: stats.pendingOrdersCount.toLocaleString('he-IL'),
      sub: 'דורש פעולה',
      subClass: 'tertiary',
    },
    {
      label: 'הכנסות החודש',
      value: `₪${stats.revenueThisMonth.toLocaleString('he-IL')}`,
      sub: `מ-${stats.monthOrdersCount.toLocaleString('he-IL')} הזמנות`,
      subClass: 'muted',
    },
  ];
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: authHeader(token) });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? 'טעינת נתוני לוח הבקרה נכשלה');
        }
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'טעינת נתוני לוח הבקרה נכשלה');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="admin-shell">
      <AdminSidebar active="dashboard" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader
            title="לוח בקרה ניהולי"
            description="ברוכים הבאים למערכת הניהול של STAGE. כאן תוכלו לנהל את כל היבטי ההפקה, המלאי וההזמנות בזמן אמת."
          />

          {error && <p className="admin-error">{error}</p>}

          {loading ? (
            <p className="admin-loading-row">טוען נתונים...</p>
          ) : stats ? (
            <StatsGrid stats={buildStatTiles(stats)} />
          ) : null}

          <DashboardActionsGrid onAddProduct={() => setIsAddPanelOpen(true)} />

          <QuickActionsGrid onAddProduct={() => setIsAddPanelOpen(true)} />

          <CategoryManager />

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console v2.4.0" />
        </div>
      </main>

      <AddProductPanel open={isAddPanelOpen} onClose={() => setIsAddPanelOpen(false)} />
    </div>
  );
}
