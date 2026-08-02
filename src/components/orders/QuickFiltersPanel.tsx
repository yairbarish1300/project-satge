import { QUICK_FILTERS } from './ordersData';

export default function QuickFiltersPanel() {
  return (
    <div className="orders-filters">
      <h3>Quick Filters</h3>
      <div className="orders-chips">
        {QUICK_FILTERS.map((f) => <button className="orders-chip" key={f}>{f}</button>)}
      </div>

      <div className="orders-export">
        <p>Export Orders</p>
        <div className="orders-export-grid">
          <button className="orders-export-btn"><span className="msym">description</span>PDF</button>
          <button className="orders-export-btn"><span className="msym">table_view</span>CSV</button>
        </div>
      </div>
    </div>
  );
}
