import TableFooter from '../admin/TableFooter';
import { statusClass, type Order } from './ordersData';

interface OrdersTableProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function OrdersTable({ orders, selectedId, onSelect }: OrdersTableProps) {
  return (
    <div className="orders-table-card">
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Company & Product</th>
              <th>Dates</th>
              <th className="ta-right">Total</th>
              <th className="ta-center">Status</th>
              <th></th>
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
                  <p className="orders-company">{order.company}</p>
                  <p className="orders-product">{order.product}</p>
                </td>
                <td><span className="orders-date-pill">{order.dates}</span></td>
                <td className="ta-right"><span className="orders-price">{order.price}</span></td>
                <td className="ta-center">
                  <span className={`orders-status ${statusClass(order.status)}`}>
                    {order.status !== 'completed' ? <span className="orders-status-dot" /> : null}
                    {order.status}
                  </span>
                </td>
                <td className="ta-right"><button className="orders-more"><span className="msym">more_vert</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter summary="Showing 1 to 5 of 847 entries" pageCount={3} activePage={1} />
    </div>
  );
}
