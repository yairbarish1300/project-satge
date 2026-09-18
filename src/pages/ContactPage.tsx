import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { SimpleFooter } from '../components/PageFooters';
import { API_BASE } from '../context/AuthContext';
import './ContactPage.css';

const REASONS = ['בקשת הצעת מחיר', 'שאלה כללית', 'תמיכה טכנית', 'שיתוף פעולה עסקי', 'אחר'];

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

export default function ContactPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('יש למלא שם מלא');
      return;
    }
    if (!phone.trim()) {
      setError('יש למלא מספר טלפון');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, reason, message }),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'שליחת הפנייה נכשלה, נסה שוב'));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שליחת הפנייה נכשלה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rp-page contact-page">
      <Header currentPage="contact" showSearch={false} />

      <main className="checkout-main contact-main">
        {submitted ? (
          <div className="checkout-success">
            <span className="msym">check_circle</span>
            <h2>הפנייה נשלחה בהצלחה!</h2>
            <p>נחזור אליך בהקדם האפשרי.</p>
            <button type="button" className="checkout-submit" onClick={() => navigate('/')}>
              <span>חזרה לדף הבית</span>
            </button>
          </div>
        ) : (
          <div className="contact-form-wrap">
            <header className="checkout-header">
              <h1>צרו קשר</h1>
              <p>השאירו פרטים ונחזור אליכם בהקדם — ללא קשר להזמנה או מוצר ספציפי.</p>
            </header>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <section className="checkout-section">
                <div className="checkout-section-title primary">
                  <span className="msym">person</span>
                  <h2>פרטי יצירת קשר</h2>
                </div>

                <div className="checkout-fields">
                  <div className="checkout-field">
                    <label htmlFor="fullName">שם מלא</label>
                    <input id="fullName" className="checkout-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ישראל ישראלי" />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">טלפון</label>
                    <input id="phone" type="tel" className="checkout-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-0000000" />
                  </div>

                  <div className="checkout-field full-width">
                    <label htmlFor="email">אימייל (אופציונלי)</label>
                    <input id="email" type="email" className="checkout-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@stage.com" />
                  </div>

                  <div className="checkout-field full-width">
                    <label htmlFor="reason">סיבת הפנייה</label>
                    <select id="reason" className="checkout-input" value={reason} onChange={(e) => setReason(e.target.value)}>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="checkout-field full-width">
                    <label htmlFor="message">הודעה (אופציונלי)</label>
                    <textarea
                      id="message"
                      className="checkout-input contact-textarea"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="ספרו לנו קצת יותר..."
                    />
                  </div>
                </div>
              </section>

              {error && <p className="checkout-error">{error}</p>}

              <div className="checkout-submit-wrap">
                <button type="submit" className="checkout-submit" disabled={submitting}>
                  <span>{submitting ? 'שולח...' : 'שלח פנייה'}</span>
                  <span className="msym">send</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <SimpleFooter
        copyright="© 2024 STAGE Event Production Services"
        links={[
          { label: 'Home', href: '#' },
          { label: 'Shop', href: '#' },
        ]}
      />
    </div>
  );
}
