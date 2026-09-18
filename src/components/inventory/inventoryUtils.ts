import type { CatalogProduct } from '../../context/ProductCatalogContext';

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

const COLUMNS: { header: string; get: (p: CatalogProduct) => string }[] = [
  { header: 'שם מוצר', get: (p) => p.name },
  { header: 'SKU', get: (p) => p.sku },
  { header: 'קטגוריה', get: (p) => p.category },
  { header: 'מחיר ליום (₪)', get: (p) => String(p.price) },
];

export function exportInventoryToCsv(products: CatalogProduct[]) {
  const rows = [COLUMNS.map((c) => c.header), ...products.map((p) => COLUMNS.map((c) => csvEscape(c.get(p))))];
  const csv = '﻿' + rows.map((row) => row.join(',')).join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `stage-inventory-${stamp}.csv`, 'text/csv;charset=utf-8');
}
