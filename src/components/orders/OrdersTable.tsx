import TableFooter from '../admin/TableFooter';
import { statusClass, statusLabel, type Order } from './ordersData';

interface OrdersTableProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  deletingId?: string | null;
}

export default function OrdersTable({ orders, selectedId, onSelect, onEdit, onDelete, deletingId }: OrdersTableProps) {
  return (
    <div className="orders-table-card">
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Company & Product</th>
              <th className="ta-right">Total</th>
              <th className="ta-center">Status</th>
              <th className="ta-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={`orders-row ${selectedId === order.id ? 'selected' : ''}`} onClick={() => onSelect(order.id)}>
                <td>
                  <div className="orders-id-cell">
                    <div className="orders-id-icon"><span className="msym">receipt_long</span></div>
                    <div>
                      <p className="orders-id-title">{order.id}</p>
                      <p className="orders-id-sub">{order.customer}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="orders-company">{order.company || '—'}</p>
                  <p className="orders-product">{order.product}</p>
                </td>
                <td className="ta-right"><span className="orders-price">{order.price}</span></td>
                <td className="ta-center">
                  <span className={`orders-status ${statusClass(order.status)}`}>
                    {order.status !== 'completed' ? <span className="orders-status-dot" /> : null}
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="ta-center" onClick={(e) => e.stopPropagation()}>
                  <div className="inv-actions">
                    <button type="button" className="inv-edit-btn" onClick={() => onEdit(order)}>ערוך</button>
                    <button
                      type="button"
                      className="inv-remove-btn"
                      disabled={deletingId === order.mongoId}
                      onClick={() => onDelete(order)}
                    >
                      {deletingId === order.mongoId ? 'מוחק...' : 'מחק'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter summary={`Showing 1 to ${orders.length} of ${orders.length} entries`} pageCount={1} activePage={1} />
    </div>
  );
}
