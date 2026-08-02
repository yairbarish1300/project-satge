import type { AdminStat } from '../admin/StatsGrid';

export interface DashboardAction {
  id: number;
  icon: string;
  title: string;
  desc: string;
  button: string;
  nav: string;
}

export const ACTIONS: DashboardAction[] = [
  { id: 1, icon: 'inventory_2', title: 'ניהול מלאי מוצרים', desc: 'מעקב אחר ציוד הגברה, תאורה ומסכים. עדכון זמינות פריטים ודוחות מלאי.', button: 'פתח ממשק מלאי', nav: '/inventory' },
  { id: 2, icon: 'receipt_long', title: 'ניהול הזמנות', desc: 'צפייה בהזמנות פעילות, אישור עסקאות חדשות וניהול לוחות זמנים.', button: 'מעבר להזמנות', nav: '/orders' },
  { id: 3, icon: 'edit_calendar', title: 'הוספה ועדכון מוצרים', desc: 'הזנת ציוד חדש למערכת, עריכת מפרטים טכניים, מחירים ותמונות מוצר.', button: 'הוסף מוצר חדש', nav: '/product' },
];

export const STATS: AdminStat[] = [
  { label: 'מוצרים במלאי', value: '1,248', sub: '+12 השבוע', subClass: 'primary' },
  { label: 'הזמנות פעילות', value: '42', sub: 'דורשות טיפול', subClass: 'secondary' },
  { label: 'ציוד בשימוש', value: '85%', sub: 'בחוץ', subClass: 'muted' },
  { label: 'הכנסות החודש', value: '₪342K', sub: 'יעד: ₪400K', subClass: 'muted' },
];

export const QUICK_ACTIONS = [
  { icon: 'add_circle', label: 'הוסף מוצר חדש' },
  { icon: 'edit_calendar', label: 'עדכן לוח זמנים' },
  { icon: 'file_download', label: 'הורד דוח מלאי' },
  { icon: 'settings', label: 'הגדרות מערכת' },
];

export const ACTION_COLOR_CLASS: Record<number, string> = {
  1: 'color-primary',
  2: 'color-secondary',
  3: 'color-green',
};

export const ACTION_BG_CLASS: Record<number, string> = {
  1: 'bg-primary-soft',
  2: 'bg-secondary-soft',
  3: 'bg-green-soft',
};
