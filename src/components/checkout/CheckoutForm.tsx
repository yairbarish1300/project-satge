import { useState } from 'react';
import { FORM_SECTIONS } from './checkoutData';
import type { CatalogProduct } from '../../context/ProductCatalogContext';
import { API_BASE } from '../../context/AuthContext';

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

interface CheckoutFormProps {
  product: CatalogProduct;
  onOrderCreated: (orderNumber: string) => void;
}

export default function CheckoutForm({ product, onOrderCreated }: CheckoutFormProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!values.fullName?.trim()) {
      setError('יש למלא שם מלא');
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
        <p>אנא מלאו את הפרטים מטה להשלמת הזמנת הציוד</p>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="checkout-submit" disabled={submitting}>
            <span>{submitting ? 'שולח...' : 'שלח הזמנה'}</span>
            <span className="msym">send</span>
          </button>
        </div>
      </form>
    </>
  );
}
