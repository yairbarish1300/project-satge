import type { Order, OrderStatus } from './ordersData';
import { formatRelativeTime } from './ordersUtils';

interface RecentActivityProps {
  orders: Order[];
}

const STATUS_ICON: Record<OrderStatus, { icon: string; colorClass: string }> = {
  approved: { icon: 'check_circle', colorClass: 'activity-green' },
  pending: { icon: 'schedule', colorClass: 'activity-blue' },
  completed: { icon: 'task_alt', colorClass: 'activity-green' },
  cancelled: { icon: 'cancel', colorClass: 'activity-orange' },
};

export default function RecentActivity({ orders }: RecentActivityProps) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="orders-activity">
      <div className="orders-activity-head">
        <h3>פעילות אחרונה</h3>
      </div>
      <div className="orders-activity-list">
        {recent.length === 0 ? (
          <p className="admin-empty-row">אין עדיין פעילות</p>
        ) : (
          recent.map((order) => {
            const { icon, colorClass } = STATUS_ICON[order.status];
            return (
              <div className="orders-activity-item" key={order.mongoId}>
                <div className={`orders-activity-icon ${colorClass}`}><span className="msym">{icon}</span></div>
                <div>
                  <p>
                    הזמנה {order.id} מאת {order.customer} — {order.product}
                  </p>
                  <p className="orders-activity-meta">{order.createdAt ? formatRelativeTime(order.createdAt) : ''}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
