import type { CatalogProduct } from '../../context/ProductCatalogContext';

interface OrderSummaryCardProps {
  product: CatalogProduct;
}

export default function OrderSummaryCard({ product }: OrderSummaryCardProps) {
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
        <div className="checkout-total">
          <span className="name">מחיר</span>
          <span className="value">₪{product.price.toLocaleString('he-IL')} {product.unit}</span>
        </div>
      </div>
    </div>
  );
}
