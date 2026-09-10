import { useNavigate } from 'react-router-dom';
import { QUICK_ACTIONS, type QuickActionKey } from './dashboardData';
import { useProductCatalog } from '../../context/ProductCatalogContext';
import { exportInventoryToCsv } from '../inventory/inventoryUtils';

interface QuickActionsGridProps {
  onAddProduct: () => void;
}

export default function QuickActionsGrid({ onAddProduct }: QuickActionsGridProps) {
  const navigate = useNavigate();
  const { products } = useProductCatalog();

  const handleClick = (key: QuickActionKey) => {
    switch (key) {
      case 'add-product':
        onAddProduct();
        break;
      case 'schedule':
        navigate('/orders');
        break;
      case 'inventory-report':
        exportInventoryToCsv(products);
        break;
      case 'settings':
        navigate('/settings');
        break;
    }
  };

  return (
    <div className="dashboard-quick">
      <h3>פעולות מהירות</h3>
      <div className="dashboard-quick-grid">
        {QUICK_ACTIONS.map((q) => (
          <button className="dashboard-quick-btn" key={q.key} onClick={() => handleClick(q.key)}>
            <span className="msym">{q.icon}</span>
            <span>{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
