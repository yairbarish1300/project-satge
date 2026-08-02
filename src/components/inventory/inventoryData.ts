import type { AdminStat } from '../admin/StatsGrid';

export type InventoryStatus = 'available' | 'in-use' | 'low-stock';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: string;
  dayRate: string;
  status: InventoryStatus;
}

export const BASE_ITEMS: InventoryItem[] = [
  { id: '1', name: 'L-Acoustics K2 Line Array', sku: 'AUD-K2-001', category: 'Sound', stock: '128/150', dayRate: '$450.00', status: 'available' },
  { id: '2', name: 'Martin MAC Viper Performance', sku: 'LGT-VIP-042', category: 'Lighting', stock: '32/80', dayRate: '$175.00', status: 'in-use' },
  { id: '3', name: 'ROE Visual Black Pearl 2.8', sku: 'VID-ROE-992', category: 'Screens', stock: '12/350', dayRate: '$120.00', status: 'low-stock' },
  { id: '4', name: 'Yamaha Rivage PM7', sku: 'AUD-YAM-007', category: 'Sound', stock: '4/4', dayRate: '$1,200.00', status: 'available' },
];

export const STATS: AdminStat[] = [
  { label: 'Items in Stock', value: '1,248', sub: '+12 this week', subClass: 'primary' },
  { label: 'Active Rentals', value: '85%', sub: 'out on site', subClass: 'secondary' },
  { label: 'Low Stock', value: '14', sub: 'needs attention', subClass: 'tertiary' },
  { label: 'Inventory Value', value: '$342K', sub: 'estimated', subClass: 'muted' },
];

export function statusClass(status: InventoryStatus) {
  if (status === 'available') return 'approved';
  if (status === 'in-use') return 'pending';
  return 'completed';
}
