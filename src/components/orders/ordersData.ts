import type { AdminStat } from '../admin/StatsGrid';

export type OrderStatus = 'approved' | 'pending' | 'completed';

export interface Order {
  id: string;
  customer: string;
  company: string;
  product: string;
  dates: string;
  price: string;
  status: OrderStatus;
}

export const ORDERS: Order[] = [
  { id: '#STG-2409', customer: 'David Cohen', company: 'Live Nation Productions', product: 'L-Acoustics K2 Array (x12)', dates: 'Oct 12 - Oct 15', price: '$12,450.00', status: 'approved' },
  { id: '#STG-2410', customer: 'Sarah Levi', company: 'TechSummit Tel Aviv', product: 'P3 LED Wall (80sqm)', dates: 'Oct 18 - Oct 20', price: '$28,900.00', status: 'pending' },
  { id: '#STG-2398', customer: 'Amir Mizrahi', company: 'Zappa Club Group', product: 'Clay Paky Sharpy (x24)', dates: 'Sep 28 - Sep 29', price: '$4,200.00', status: 'completed' },
  { id: '#STG-2411', customer: 'Noa Dayan', company: 'Fashion Week \'24', product: 'Midas HD96-24 Console', dates: 'Nov 02 - Nov 05', price: '$1,850.00', status: 'pending' },
  { id: '#STG-2412', customer: 'Itay Peretz', company: 'Solar Music Festival', product: 'Truss System + Rigging', dates: 'Oct 25 - Oct 28', price: '$6,700.00', status: 'approved' },
];

export const STATS: AdminStat[] = [
  { label: 'Total Rentals', value: '847', sub: '+12.5%', subClass: 'primary' },
  { label: 'Active Orders', value: '42', sub: 'In Progress', subClass: 'secondary' },
  { label: 'Pending Approval', value: '14', sub: 'Requires Action', subClass: 'tertiary' },
  { label: 'Revenue This Week', value: '$487k', sub: 'USD', subClass: 'muted' },
];

export const QUICK_FILTERS = ['Approved', 'Pending', 'Completed', 'This Week', 'High Value', 'New Customers'];

export const RECENT_ACTIVITY = [
  { icon: 'check_circle', colorClass: 'activity-green', text: 'Order #STG-2409 was Approved by Live Nation Productions.', meta: '2 hours ago • Action by Sarah Miller' },
  { icon: 'schedule', colorClass: 'activity-blue', text: 'New Order Received: TechSummit Tel Aviv requested P3 LED Wall (80sqm) rental.', meta: '5 hours ago • System Automated' },
  { icon: 'info', colorClass: 'activity-orange', text: 'Order Alert: #STG-2411 from Fashion Week requires approval before preparation.', meta: 'Yesterday • Pending Review' },
];

export function statusClass(status: OrderStatus) {
  if (status === 'approved') return 'approved';
  if (status === 'pending') return 'pending';
  return 'completed';
}
