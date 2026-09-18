export type OrderStatus = 'approved' | 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string; // human-readable order number, e.g. "#STG-2409" (display id)
  mongoId: string; // real database id, used for edit/delete requests
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  company: string;
  productId?: string;
  product: string; // product name
  price: string;
  totalPrice?: number;
  status: OrderStatus;
  notes?: string;
  createdAt?: string;
}

export const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'pending', label: 'ממתין' },
  { value: 'approved', label: 'מאושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
];

export function statusClass(status: OrderStatus) {
  if (status === 'approved') return 'approved';
  if (status === 'pending') return 'pending';
  if (status === 'cancelled') return 'cancelled';
  return 'completed';
}

export function statusLabel(status: OrderStatus) {
  if (status === 'approved') return 'מאושר';
  if (status === 'pending') return 'ממתין';
  if (status === 'cancelled') return 'בוטל';
  return 'הושלם';
}
