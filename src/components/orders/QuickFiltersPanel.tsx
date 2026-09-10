import { STATUS_FILTERS, type Order, type OrderStatus } from './ordersData';
import { exportOrdersToCsv, exportOrdersToPdf } from './ordersUtils';

interface QuickFiltersPanelProps {
  activeFilter: OrderStatus | 'all';
  onFilterChange: (status: OrderStatus | 'all') => void;
  exportOrders: Order[];
}

export default function QuickFiltersPanel({ activeFilter, onFilterChange, exportOrders }: QuickFiltersPanelProps) {
  return (
    <div className="orders-filters">
      <h3>Quick Filters</h3>
      <div className="orders-chips">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`orders-chip ${activeFilter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="orders-export">
        <p>Export Orders ({exportOrders.length})</p>
        <div className="orders-export-grid">
          <button className="orders-export-btn" onClick={() => exportOrdersToPdf(exportOrders)} disabled={exportOrders.length === 0}>
            <span className="msym">description</span>PDF
          </button>
          <button className="orders-export-btn" onClick={() => exportOrdersToCsv(exportOrders)} disabled={exportOrders.length === 0}>
            <span className="msym">table_view</span>CSV
          </button>
        </div>
      </div>
    </div>
  );
}
