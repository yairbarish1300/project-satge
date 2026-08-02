import { useNavigate } from 'react-router-dom';
import { ACTIONS, ACTION_BG_CLASS, ACTION_COLOR_CLASS } from './dashboardData';

interface DashboardActionsGridProps {
  onAddProduct: () => void;
}

export default function DashboardActionsGrid({ onAddProduct }: DashboardActionsGridProps) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-actions">
      {ACTIONS.map((a) => (
        <div className="dashboard-action-card" key={a.id}>
          <div className="dashboard-action-top">
            <div className={`dashboard-action-icon ${ACTION_BG_CLASS[a.id]} ${ACTION_COLOR_CLASS[a.id]}`}><span className="msym">{a.icon}</span></div>
            <h3 className="dashboard-action-title">{a.title}</h3>
          </div>
          <p className="dashboard-action-desc">{a.desc}</p>
          <button
            className={`dashboard-action-btn ${ACTION_COLOR_CLASS[a.id]}`}
            onClick={() => (a.id === 3 ? onAddProduct() : navigate(a.nav))}
          >
            <span className="msym">arrow_forward</span>
            {a.button}
          </button>
        </div>
      ))}
    </div>
  );
}
