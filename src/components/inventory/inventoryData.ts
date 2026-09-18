import type { AdminStat } from '../admin/StatsGrid';
import type { CatalogProduct } from '../../context/ProductCatalogContext';

// Computed live from the real product catalog — no hardcoded placeholder numbers.
export function buildInventoryStats(products: CatalogProduct[]): AdminStat[] {
  const categoriesInUse = new Set(products.map((p) => p.category).filter(Boolean)).size;
  const avgPrice = products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0;

  const priciest = products.reduce<CatalogProduct | null>(
    (max, p) => (max === null || p.price > max.price ? p : max),
    null,
  );

  return [
    { label: 'מוצרים בקטלוג', value: products.length.toLocaleString('he-IL'), sub: 'סה"כ מוצרים פעילים', subClass: 'primary' },
    { label: 'קטגוריות בשימוש', value: categoriesInUse.toLocaleString('he-IL'), sub: 'קטגוריות שונות', subClass: 'secondary' },
    { label: 'מחיר יומי ממוצע', value: `₪${avgPrice.toLocaleString('he-IL')}`, sub: 'על פני כל הקטלוג', subClass: 'tertiary' },
    {
      label: 'המחיר הגבוה ביותר',
      value: priciest ? `₪${priciest.price.toLocaleString('he-IL')}` : '—',
      sub: priciest ? priciest.name : 'אין מוצרים',
      subClass: 'muted',
    },
  ];
}
