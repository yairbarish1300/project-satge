import TableFooter from '../admin/TableFooter';
import type { CatalogProduct } from '../../context/ProductCatalogContext';
import { statusClass, inventoryStatusFor } from './inventoryData';

interface InventoryTableProps {
  items: CatalogProduct[];
  totalCount: number;
  onEdit: (item: CatalogProduct) => void;
  onDelete: (item: CatalogProduct) => void;
  deletingId?: string | null;
}

export default function InventoryTable({ items, totalCount, onEdit, onDelete, deletingId }: InventoryTableProps) {
  return (
    <div className="orders-table-card">
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Equipment</th>
              <th>SKU</th>
              <th>Category</th>
              <th className="ta-right">Stock</th>
              <th className="ta-right">Day Rate</th>
              <th className="ta-center">Status</th>
              <th className="ta-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = inventoryStatusFor(item.stockTotal);
              return (
                <tr key={item.id} className="orders-row">
                  <td>
                    <div className="orders-id-cell">
                      <div className="orders-id-icon"><span className="msym">inventory_2</span></div>
                      <div>
                        <p className="orders-id-title">{item.name}</p>
                        <p className="orders-id-sub">Equipment ID #{item.id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="orders-company">{item.sku}</p>
                    <p className="orders-product">Asset Code</p>
                  </td>
                  <td><span className="orders-date-pill">{item.category}</span></td>
                  <td className="ta-right"><span className="orders-price">{item.stockTotal} יח'</span></td>
                  <td className="ta-right"><span className="orders-price">₪{item.price.toLocaleString('he-IL')}</span></td>
                  <td className="ta-center">
                    <span className={`orders-status ${statusClass(status)}`}>
                      {status !== 'available' ? <span className="orders-status-dot" /> : null}
                      {status}
                    </span>
                  </td>
                  <td className="ta-center">
                    <div className="inv-actions">
                      <button type="button" className="inv-edit-btn" onClick={() => onEdit(item)}>ערוך</button>
                      <button
                        type="button"
                        className="inv-remove-btn"
                        disabled={deletingId === item.id}
                        onClick={() => onDelete(item)}
                      >
                        {deletingId === item.id ? 'מוחק...' : 'מחק'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TableFooter summary={`Showing 1 to ${items.length} of ${totalCount} entries`} pageCount={1} activePage={1} />
    </div>
  );
}
