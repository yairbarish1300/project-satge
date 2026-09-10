import type { AdminStat } from '../admin/StatsGrid';
import type { CatalogProduct } from '../../context/ProductCatalogContext';

export type InventoryStatus = 'available' | 'out-of-stock' | 'low-stock';

export function statusClass(status: InventoryStatus) {
  if (status === 'available') return 'approved';
  if (status === 'out-of-stock') return 'pending';
  return 'completed';
}

// This reflects total fleet size, not real-time availability — whether a
// unit is actually free depends on the requested date range (checked at
// booking time), so this is only a coarse "how big is this fleet" signal.
export function inventoryStatusFor(stockTotal: number): InventoryStatus {
  if (stockTotal === 0) return 'out-of-stock';
  if (stockTotal <= 3) return 'low-stock';
  return 'available';
}

// Computed live from the real product catalog — no hardcoded placeholder numbers.
// (There used to be an "estimated inventory value" tile here computed as
// price-per-day × quantity, but that conflates daily rental price with asset
// value and doesn't mean anything real — removed rather than show a wrong number.)
export function buildInventoryStats(products: CatalogProduct[]): AdminStat[] {
  const totalUnits = products.reduce((sum, p) => sum + p.stockTotal, 0);
  const lowStockCount = products.filter((p) => p.stockTotal > 0 && p.stockTotal <= 3).length;
  const outOfStockCount = products.filter((p) => p.stockTotal === 0).length;
  const categoriesInUse = new Set(products.map((p) => p.category).filter(Boolean)).size;

  return [
    { label: 'מוצרים במלאי', value: products.length.toLocaleString('he-IL'), sub: `${totalUnits.toLocaleString('he-IL')} יחידות בסה"כ`, subClass: 'primary' },
    { label: 'מלאי נמוך', value: lowStockCount.toLocaleString('he-IL'), sub: lowStockCount > 0 ? 'דורש תשומת לב' : 'הכל תקין', subClass: 'tertiary' },
    { label: 'חסר מלאי', value: outOfStockCount.toLocaleString('he-IL'), sub: outOfStockCount > 0 ? 'לא זמין להזמנה' : 'אין מוצרים חסרים', subClass: 'secondary' },
    { label: 'קטגוריות בשימוש', value: categoriesInUse.toLocaleString('he-IL'), sub: 'קטגוריות שונות במלאי', subClass: 'muted' },
  ];
}
