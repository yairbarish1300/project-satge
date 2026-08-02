import { useState } from 'react';
import { FORM_SECTIONS } from './checkoutData';

const sectionTitleClass = (icon: string) =>
  icon === 'payments' ? 'checkout-section-title secondary' : 'checkout-section-title primary';

const sectionGridClass = (icon: string) =>
  icon === 'payments' ? 'checkout-fields single-col' : 'checkout-fields';

export default function CheckoutForm() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <>
      <header className="checkout-header">
        <h1>פרטי הזמנה</h1>
        <p>אנא מלאו את הפרטים מטה להשלמת השכרת הציוד</p>
      </header>

      <form className="checkout-form">
        {FORM_SECTIONS.map((section, idx) => (
          <section
            key={idx}
            className={`checkout-section ${focusedInput?.startsWith(`section-${idx}`) ? 'focused' : ''}`}
          >
            <div className={sectionTitleClass(section.icon)}>
              <span className="msym">{section.icon}</span>
              <h2>{section.title}</h2>
            </div>

            <div className={sectionGridClass(section.icon)}>
              {section.fields.map((field, fieldIdx) => (
                <div key={fieldIdx} className={`checkout-field ${field.fullWidth ? 'full-width' : ''}`}>
                  <label>{field.label}</label>
                  {field.icon ? (
                    <div className="checkout-input-wrap">
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        onFocus={() => setFocusedInput(`section-${idx}-field-${fieldIdx}`)}
                        onBlur={() => setFocusedInput(null)}
                        className="checkout-input-icon"
                      />
                      <span className="msym">{field.icon}</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      onFocus={() => setFocusedInput(`section-${idx}-field-${fieldIdx}`)}
                      onBlur={() => setFocusedInput(null)}
                      className="checkout-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="checkout-submit-wrap">
          <button type="submit" className="checkout-submit">
            <span>שלח הזמנה</span>
            <span className="msym">send</span>
          </button>
        </div>
      </form>
    </>
  );
}
