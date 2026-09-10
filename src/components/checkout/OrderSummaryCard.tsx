import type { CatalogProduct } from '../../context/ProductCatalogContext';

interface OrderSummaryCardProps {
  product: CatalogProduct;
  quantity: number;
  days: number;
  totalPrice: number;
}

export default function OrderSummaryCard({ product, quantity, days, totalPrice }: OrderSummaryCardProps) {
  const hasRange = days > 0;

  return (
    <div className="checkout-card">
      <div className="checkout-card-hero">
        <img src={product.image} alt={product.name} />
        <div className="checkout-card-overlay" />
        <div className="checkout-card-caption">
          <span className="checkout-badge">{product.category}</span>
          <h3>{product.name}</h3>
        </div>
      </div>

      <div className="checkout-card-body">
        <div className="checkout-row label">
          <span>מחיר ליחידה ליום</span>
          <span className="value">₪{product.price.toLocaleString('he-IL')}</span>
        </div>

        <div className="checkout-breakdown">
          <div className="item">
            <span className="name">כמות</span>
            <span>{quantity} יח'</span>
          </div>
          <div className="item">
            <span className="name">משך השכרה</span>
            <span>{hasRange ? `${days} ${days === 1 ? 'יום' : 'ימים'}` : '—'}</span>
          </div>
        </div>

        <div className="checkout-total">
          <span className="name">סה"כ לתשלום</span>
          <span className="value">₪{totalPrice.toLocaleString('he-IL')}</span>
        </div>
      </div>
    </div>
  );
}
