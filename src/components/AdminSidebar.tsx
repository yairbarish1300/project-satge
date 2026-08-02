import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductPanel from './AddProductPanel';

type AdminSection = 'inventory' | 'orders' | 'dashboard';

type AdminSidebarProps = {
  active: AdminSection;
};

const AVATAR_DATA_URI =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%231c1b1b'/%3E%3Ccircle cx='60' cy='48' r='20' fill='%234be277'/%3E%3Crect x='30' y='72' width='60' height='24' rx='12' fill='%23adc6ff'/%3E%3C/svg%3E";

export default function AdminSidebar({ active }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo-wrap">
        <h1 className="admin-logo" onClick={() => navigate('/')}>STAGE</h1>
        <p className="admin-sub">ADMIN PANEL</p>
      </div>

      <nav className="admin-nav">
        <div className={`admin-nav-item ${active === 'inventory' ? 'active' : ''}`} onClick={() => navigate('/inventory')}>
          <span className="msym">inventory_2</span>
          <span>Inventory</span>
        </div>
        <div className={`admin-nav-item ${active === 'orders' ? 'active' : ''}`} onClick={() => navigate('/orders')}>
          <span className="msym">receipt_long</span>
          <span>Orders</span>
        </div>
        <div className={`admin-nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
          <span className="msym">edit_calendar</span>
          <span>Manage Products</span>
        </div>
      </nav>

      <div className="admin-cta-wrap">
        <button className="admin-cta" onClick={() => setIsAddPanelOpen(true)}><span className="msym">add</span>Add Product</button>
      </div>

      <div className="admin-user-wrap">
        <div className="admin-user-card">
          <div className="admin-avatar">
            <img src={AVATAR_DATA_URI} alt="Admin" />
          </div>
          <div>
            <p className="admin-user-name">Admin User</p>
            <p className="admin-user-role">Master Access</p>
          </div>
        </div>
        <div className="admin-user-action"><span className="msym">settings</span><span>Settings</span></div>
        <div className="admin-user-action" onClick={() => navigate('/login')}><span className="msym">logout</span><span>Logout</span></div>
      </div>

      <AddProductPanel open={isAddPanelOpen} onClose={() => setIsAddPanelOpen(false)} />
    </aside>
  );
}