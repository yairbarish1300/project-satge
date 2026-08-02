export interface AdminStat {
  label: string;
  value: string;
  sub: string;
  subClass: string;
}

interface StatsGridProps {
  stats: AdminStat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="admin-stats">
      {stats.map((s) => (
        <div key={s.label} className="admin-stat">
          <p className="admin-stat-label">{s.label}</p>
          <div className="admin-stat-row">
            <span className="admin-stat-value">{s.value}</span>
            <span className={`admin-stat-sub ${s.subClass}`}>{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
