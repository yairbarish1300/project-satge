import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from './ordersData';
// Reuses the AddProductPanel's overlay/panel styles — same slide-over form look.
import '../AddProductPanel.css';

type OrderUpdateInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  totalPrice: number;
  status: OrderStatus;
  notes: string;
};

interface OrderEditPanelProps {
  order: Order | null;
  onClose: () => void;
  onSave: (mongoId: string, input: OrderUpdateInput) => Promise<void>;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'ממתין' },
  { value: 'approved', label: 'מאושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
];

export default function OrderEditPanel({ order, onClose, onSave }: OrderEditPanelProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [company, setCompany] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!order) return;
    setCustomerName(order.customer);
    setCustomerEmail(order.customerEmail ?? '');
    setCustomerPhone(order.customerPhone ?? '');
    setCompany(order.company);
    setTotalPrice(order.totalPrice !== undefined ? String(order.totalPrice) : '');
    setStatus(order.status);
    setNotes(order.notes ?? '');
    setError('');
  }, [order]);

  if (!order) return null;

  const closePanel = () => {
    setError('');
    onClose();
  };

  const handleSave = async () => {
    const parsedPrice = Number(totalPrice);

    if (!customerName.trim()) {
      setError('יש למלא שם לקוח.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('יש להזין סכום תקין.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave(order.mongoId, {
        customerName,
        customerEmail,
        customerPhone,
        company,
        totalPrice: parsedPrice,
        status,
        notes,
      });
      closePanel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'השמירה נכשלה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-overlay" onClick={closePanel}>
      <section className="add-product-panel" onClick={(e) => e.stopPropagation()}>
        <div className="add-product-head">
          <div>
            <h3>עריכת הזמנה {order.id}</h3>
            <p>המוצר המוזמן אינו ניתן לשינוי — ניתן לבטל את ההזמנה ולפתוח הזמנה חדשה במקומה.</p>
          </div>
          <button className="add-product-close" onClick={closePanel} aria-label="Close panel">
            <span className="msym">close</span>
          </button>
        </div>

        <div className="add-product-body">
          <div className="add-product-field add-product-field-full order-reserved-summary">
            <span>מוצר (קבוע)</span>
            <p>{order.product}</p>
          </div>

          <label className="add-product-field">
            <span>שם לקוח</span>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </label>

          <label className="add-product-field">
            <span>חברה</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} />
          </label>

          <label className="add-product-field">
            <span>אימייל</span>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </label>

          <label className="add-product-field">
            <span>טלפון</span>
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
          </label>

          <label className="add-product-field">
            <span>סכום כולל (₪)</span>
            <input type="number" min="0" step="1" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
          </label>

          <label className="add-product-field">
            <span>סטטוס</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="add-product-field add-product-field-full">
            <span>הערות</span>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>

        {error ? <p className="add-product-error">{error}</p> : null}

        <div className="add-product-actions">
          <button className="add-product-cancel" onClick={closePanel}>ביטול</button>
          <button className="add-product-submit" onClick={handleSave} disabled={submitting}>
            {submitting ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </section>
    </div>
  );
}
