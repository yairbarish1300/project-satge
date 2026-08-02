import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AddProductPanel from '../components/AddProductPanel';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import StatsGrid from '../components/admin/StatsGrid';
import DashboardActionsGrid from '../components/dashboard/DashboardActionsGrid';
import QuickActionsGrid from '../components/dashboard/QuickActionsGrid';
import CategoryManager from '../components/dashboard/CategoryManager';
import { AdminFooter } from '../components/PageFooters';
import { STATS } from '../components/dashboard/dashboardData';
import './DashboardPage.css';

export default function DashboardPage() {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar active="dashboard" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader
            title="לוח בקרה ניהולי"
            description="ברוכים הבאים למערכת הניהול של STAGE. כאן תוכלו לנהל את כל היבטי ההפקה, המלאי וההזמנות בזמן אמת."
          />

          <StatsGrid stats={STATS} />

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
