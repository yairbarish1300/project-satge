import AdminSidebar from '../components/AdminSidebar';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import { AdminFooter } from '../components/PageFooters';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user, isManager } = useAuth();

  return (
    <div className="admin-shell">
      <AdminSidebar active="dashboard" />

      <main className="admin-main">
        <div className="admin-content">
          <AdminPageHeader title="הגדרות מערכת" description="פרטי החשבון המחובר למערכת." />

          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">שם מלא</span>
              <span className="settings-value">{user?.fullName}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">שם משתמש</span>
              <span className="settings-value">{user?.username}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">הרשאה</span>
              <span className="settings-value">{isManager ? 'מנהל' : 'עובד'}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">חבר/ה במערכת מתאריך</span>
              <span className="settings-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('he-IL') : '—'}
              </span>
            </div>
          </div>

          <AdminFooter copyright="© 2024 STAGE Event Production Services | Management Console" />
        </div>
      </main>
    </div>
  );
}
