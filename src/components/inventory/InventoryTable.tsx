import TableFooter from '../admin/TableFooter';
import { statusClass, type InventoryItem } from './inventoryData';

interface InventoryTableProps {
  items: InventoryItem[];
  totalCount: number;
}

export default function InventoryTable({ items, totalCount }: InventoryTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="orders-row">
                <td>
                  <div className="orders-id-cell">
                    <div className="orders-id-icon"><span className="msym">inventory_2</span></div>
                    <div>
                      <p className="orders-id-title">{item.name}</p>
                      <p className="orders-id-sub">Equipment ID #{item.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="orders-company">{item.sku}</p>
                  <p className="orders-product">Asset Code</p>
                </td>
                <td><span className="orders-date-pill">{item.category}</span></td>
                <td className="ta-right"><span className="orders-price">{item.stock}</span></td>
                <td className="ta-right"><span className="orders-price">{item.dayRate}</span></td>
                <td className="ta-center">
                  <span className={`orders-status ${statusClass(item.status)}`}>
                    {item.status !== 'available' ? <span className="orders-status-dot" /> : null}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TableFooter summary={`Showing 1 to ${items.length} of ${totalCount} entries`} pageCount={1} activePage={1} />
    </div>
  );
}
