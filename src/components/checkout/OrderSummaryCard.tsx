import { PRODUCT } from './checkoutData';

export default function OrderSummaryCard() {
  return (
    <div className="checkout-card">
      <div className="checkout-card-hero">
        <img src={PRODUCT.image} alt={PRODUCT.title} />
        <div className="checkout-card-overlay" />
        <div className="checkout-card-caption">
          <span className="checkout-badge">{PRODUCT.subtitle}</span>
          <h3>{PRODUCT.title}</h3>
        </div>
      </div>

      <div className="checkout-card-body">
        <div className="checkout-row label">
          <span>מחיר ליום</span>
          <span className="value">₪{PRODUCT.pricePerDay.toLocaleString()}</span>
        </div>

        <div className="checkout-breakdown">
          {PRODUCT.breakdown.map((item, idx) => (
            <div key={idx} className="item">
              <span className="name">{item.label}</span>
              <span>₪{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="checkout-total">
          <span className="name">סה"כ לתשלום</span>
          <span className="value">₪{PRODUCT.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
