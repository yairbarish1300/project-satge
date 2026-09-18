import { statusLabel, type Order } from './ordersData';

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'ממש עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'אתמול';
  if (days < 30) return `לפני ${days} ימים`;
  return new Date(iso).toLocaleDateString('he-IL');
}

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

const CSV_COLUMNS: { header: string; get: (o: Order) => string }[] = [
  { header: 'מספר הזמנה', get: (o) => o.id },
  { header: 'לקוח', get: (o) => o.customer },
  { header: 'אימייל', get: (o) => o.customerEmail ?? '' },
  { header: 'טלפון', get: (o) => o.customerPhone ?? '' },
  { header: 'חברה', get: (o) => o.company },
  { header: 'מוצר', get: (o) => o.product },
  { header: 'סכום', get: (o) => o.price },
  { header: 'סטטוס', get: (o) => statusLabel(o.status) },
];

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportOrdersToCsv(orders: Order[]) {
  const rows = [CSV_COLUMNS.map((c) => c.header), ...orders.map((o) => CSV_COLUMNS.map((c) => csvEscape(c.get(o))))];
  // A UTF-8 BOM keeps Hebrew text readable when the file is opened in Excel.
  const csv = '﻿' + rows.map((row) => row.join(',')).join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `stage-orders-${stamp}.csv`, 'text/csv;charset=utf-8');
}

export function exportOrdersToPdf(orders: Order[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rowsHtml = orders
    .map(
      (o) => `
      <tr>
        <td>${o.id}</td>
        <td>${o.customer}</td>
        <td>${o.company || '—'}</td>
        <td>${o.product}</td>
        <td>${o.price}</td>
        <td>${statusLabel(o.status)}</td>
      </tr>`,
    )
    .join('');

  printWindow.document.write(`
    <!doctype html>
    <html lang="he" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>דוח הזמנות STAGE</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p { color: #555; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: right; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>דוח הזמנות — STAGE Event Production Services</h1>
        <p>${new Date().toLocaleDateString('he-IL')} · ${orders.length} הזמנות</p>
        <table>
          <thead>
            <tr><th>הזמנה</th><th>לקוח</th><th>חברה</th><th>מוצר</th><th>סכום</th><th>סטטוס</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
