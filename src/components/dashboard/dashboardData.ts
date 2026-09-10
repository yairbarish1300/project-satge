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

export type QuickActionKey = 'add-product' | 'schedule' | 'inventory-report' | 'settings';

export const QUICK_ACTIONS: { key: QuickActionKey; icon: string; label: string }[] = [
  { key: 'add-product', icon: 'add_circle', label: 'הוסף מוצר חדש' },
  { key: 'schedule', icon: 'edit_calendar', label: 'עדכן לוח זמנים' },
  { key: 'inventory-report', icon: 'file_download', label: 'הורד דוח מלאי' },
  { key: 'settings', icon: 'settings', label: 'הגדרות מערכת' },
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
