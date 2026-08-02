import { RECENT_ACTIVITY } from './ordersData';

export default function RecentActivity() {
  return (
    <div className="orders-activity">
      <div className="orders-activity-head">
        <h3>Recent Activity</h3>
        <a href="#" className="orders-view-log">View Log</a>
      </div>
      <div className="orders-activity-list">
        {RECENT_ACTIVITY.map((item, idx) => (
          <div className="orders-activity-item" key={idx}>
            <div className={`orders-activity-icon ${item.colorClass}`}><span className="msym">{item.icon}</span></div>
            <div>
              <p>{item.text}</p>
              <p className="orders-activity-meta">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
