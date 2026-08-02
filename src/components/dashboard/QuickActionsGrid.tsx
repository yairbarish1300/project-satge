import { QUICK_ACTIONS } from './dashboardData';

interface QuickActionsGridProps {
  onAddProduct: () => void;
}

export default function QuickActionsGrid({ onAddProduct }: QuickActionsGridProps) {
  return (
    <div className="dashboard-quick">
      <h3>פעולות מהירות</h3>
      <div className="dashboard-quick-grid">
        {QUICK_ACTIONS.map((q) => (
          <button
            className="dashboard-quick-btn"
            key={q.label}
            onClick={() => {
              if (q.label === 'הוסף מוצר חדש') onAddProduct();
            }}
          >
            <span className="msym">{q.icon}</span>
            <span>{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
