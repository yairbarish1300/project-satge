import { useEffect, useRef, useState } from 'react';
import { FORM_SECTIONS } from './checkoutData';
import { useProductCatalog, type CatalogProduct, type AvailabilityResult } from '../../context/ProductCatalogContext';
import { API_BASE } from '../../context/AuthContext';

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

// Local calendar date as "YYYY-MM-DD" — using toISOString() directly would
// report UTC's date, which is a day behind local time for part of the day
// in timezones ahead of UTC (e.g. Israel), letting "today" silently accept
// yesterday's date as the minimum.
const todayIso = () => {
  const now = new Date();
  const localMidnight = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localMidnight.toISOString().slice(0, 10);
};

interface CheckoutFormProps {
  product: CatalogProduct;
  startDate: string;
  endDate: string;
  quantity: number;
  days: number;
  totalPrice: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onOrderCreated: (orderNumber: string) => void;
}

export default function CheckoutForm({
  product,
  startDate,
  endDate,
  quantity,
  days,
  totalPrice,
  onStartDateChange,
  onEndDateChange,
  onQuantityChange,
  onOrderCreated,
}: CheckoutFormProps) {
  const { checkAvailability } = useProductCatalog();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const requestSeq = useRef(0);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Keep the range valid instead of silently going inverted: moving the
  // start past the current end pulls the end along with it, and an end
  // picked before the current start snaps up to the start.
  const handleStartDateChange = (value: string) => {
    onStartDateChange(value);
    if (endDate && value > endDate) {
      onEndDateChange(value);
    }
  };

  const handleEndDateChange = (value: string) => {
    onEndDateChange(startDate && value < startDate ? startDate : value);
  };

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) {
      setAvailability(null);
      setAvailabilityError('');
      return;
    }

    const seq = ++requestSeq.current;
    setCheckingAvailability(true);
    setAvailabilityError('');

    const timer = setTimeout(() => {
      checkAvailability(product.id, startDate, endDate)
        .then((result) => {
          if (requestSeq.current !== seq) return;
          setAvailability(result);
        })
        .catch((err) => {
          if (requestSeq.current !== seq) return;
          setAvailability(null);
          setAvailabilityError(err instanceof Error ? err.message : 'בדיקת הזמינות נכשלה');
        })
        .finally(() => {
          if (requestSeq.current === seq) setCheckingAvailability(false);
        });
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, startDate, endDate]);

  // Do NOT floor this to 1 — when availableUnits is 0 the product is fully
  // booked for these dates, and the UI below needs to know that to disable
  // the quantity field and the submit button instead of quietly offering "1".
  const maxQuantity = availability ? availability.availableUnits : product.stockTotal;
  const dateRangeInvalid = Boolean(startDate && endDate && startDate > endDate);
  const soldOut = availability !== null && availability.availableUnits === 0;

  // Single source of truth for clamping: covers a fresh availability result
  // AND switching to a different (smaller-stock) product before any dates
  // are picked, instead of duplicating this check in both places.
  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      onQuantityChange(maxQuantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxQuantity]);

  const [quantityText, setQuantityText] = useState(String(quantity));
  useEffect(() => {
    setQuantityText(String(quantity));
  }, [quantity]);

  const commitQuantity = (raw: string) => {
    const parsed = Number(raw);
    const clamped = Math.max(1, Math.min(maxQuantity || 1, Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1));
    onQuantityChange(clamped);
    setQuantityText(String(clamped));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Read the quantity fresh from the text buffer rather than the (possibly
    // stale) committed value — pressing Enter to submit fires before blur,
    // so the last keystroke wouldn't otherwise be reflected in what's sent.
    const rawQty = Number(quantityText);
    const finalQuantity = Math.max(1, Math.min(maxQuantity || 1, Number.isFinite(rawQty) && rawQty > 0 ? Math.floor(rawQty) : 1));
    commitQuantity(quantityText);

    if (!values.fullName?.trim()) {
      setError('יש למלא שם מלא');
      return;
    }
    if (!startDate || !endDate || startDate > endDate) {
      setError('יש לבחור טווח תאריכים תקין');
      return;
    }
    if (soldOut) {
      setError('אין יחידות פנויות בתאריכים אלו, נסו טווח תאריכים אחר');
      return;
    }
    if (availability && finalQuantity > availability.availableUnits) {
      setError(`אין מספיק יחידות פנויות בתאריכים אלו (זמינות: ${availability.availableUnits})`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: values.fullName,
          customerEmail: values.email ?? '',
          customerPhone: values.phone ?? '',
          productId: product.id,
          quantity: finalQuantity,
          startDate,
          endDate,
          notes: values.address ? `כתובת למשלוח: ${values.address}` : '',
        }),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'שליחת ההזמנה נכשלה, נסה שוב'));
      const data = await res.json();
      onOrderCreated(data.order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שליחת ההזמנה נכשלה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="checkout-header">
        <h1>פרטי הזמנה</h1>
        <p>אנא מלאו את הפרטים מטה להשלמת השכרת הציוד</p>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <section className={`checkout-section ${focusedInput?.startsWith('rental') ? 'focused' : ''}`}>
          <div className="checkout-section-title primary">
            <span className="msym">calendar_today</span>
            <h2>מועד השכרה</h2>
          </div>

          <div className="checkout-fields">
            <div className="checkout-field">
              <label htmlFor="startDate">מתאריך</label>
              <input
                id="startDate"
                type="date"
                min={todayIso()}
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                onFocus={() => setFocusedInput('rental-start')}
                onBlur={() => setFocusedInput(null)}
                className="checkout-input"
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="endDate">עד תאריך</label>
              <input
                id="endDate"
                type="date"
                min={startDate || todayIso()}
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                onFocus={() => setFocusedInput('rental-end')}
                onBlur={() => setFocusedInput(null)}
                className="checkout-input"
              />
            </div>
            <div className="checkout-field">
              <label htmlFor="quantity">כמות</label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={maxQuantity || 1}
                value={quantityText}
                disabled={soldOut}
                onChange={(e) => setQuantityText(e.target.value)}
                onBlur={() => {
                  commitQuantity(quantityText);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('rental-qty')}
                className="checkout-input"
              />
            </div>
            <div className="checkout-field">
              <label>ימים</label>
              <input className="checkout-input" value={dateRangeInvalid ? '—' : startDate && endDate ? days : '—'} disabled readOnly />
            </div>
          </div>

          <p className={`checkout-availability-note ${dateRangeInvalid || soldOut || availabilityError ? 'warning' : ''}`}>
            {!startDate || !endDate
              ? 'בחר טווח תאריכים כדי לבדוק זמינות'
              : dateRangeInvalid
                ? 'תאריך הסיום חייב להיות בתאריך ההתחלה או אחריו'
                : checkingAvailability
                  ? 'בודק זמינות...'
                  : availabilityError
                    ? availabilityError
                    : soldOut
                      ? 'אין יחידות פנויות בתאריכים אלו — נסו טווח תאריכים אחר'
                      : availability
                        ? `זמינות בתאריכים אלו: ${availability.availableUnits} מתוך ${availability.stockTotal} יחידות`
                        : ''}
          </p>
        </section>

        {FORM_SECTIONS.map((section, idx) => (
          <section
            key={idx}
            className={`checkout-section ${focusedInput?.startsWith(`section-${idx}`) ? 'focused' : ''}`}
          >
            <div className="checkout-section-title primary">
              <span className="msym">{section.icon}</span>
              <h2>{section.title}</h2>
            </div>

            <div className="checkout-fields">
              {section.fields.map((field, fieldIdx) => (
                <div key={field.name} className={`checkout-field ${field.fullWidth ? 'full-width' : ''}`}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ''}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    onFocus={() => setFocusedInput(`section-${idx}-field-${fieldIdx}`)}
                    onBlur={() => setFocusedInput(null)}
                    className="checkout-input"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        {error && <p className="checkout-error">{error}</p>}

        <div className="checkout-submit-wrap">
          <button type="submit" className="checkout-submit" disabled={submitting || dateRangeInvalid || soldOut}>
            <span>{submitting ? 'שולח...' : `שלח הזמנה — ₪${totalPrice.toLocaleString('he-IL')}`}</span>
            <span className="msym">send</span>
          </button>
        </div>
      </form>
    </>
  );
}
