import type { CatalogProduct } from '../../context/ProductCatalogContext';

interface ProductDetailPanelProps {
  product: CatalogProduct;
  onClose: () => void;
  onOrder: () => void;
}

export default function ProductDetailPanel({ product, onClose, onOrder }: ProductDetailPanelProps) {
  return (
    <div className="rp-product-panel-overlay" onClick={onClose}>
      <section className="rp-product-panel" onClick={(e) => e.stopPropagation()}>
        <button className="rp-product-panel-close" onClick={onClose} aria-label="Close product details">
          <span className="msym">close</span>
        </button>

        <div className="rp-product-panel-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="rp-product-panel-body">
          <p className="rp-product-panel-sku">{product.sku}</p>
          <h3>{product.name}</h3>
          <p className="rp-product-panel-description">{product.description}</p>

          <div className="rp-product-panel-meta">
            <p><strong>קטגוריה:</strong> {product.category}</p>
            <p><strong>סה"כ יחידות בפארק הציוד:</strong> {product.stockTotal}</p>
            <p><strong>מחיר:</strong> ₪ {product.price} {product.unit}</p>
          </div>

          {product.tags.length ? (
            <p className="rp-product-panel-tags">{product.tags.map((tag) => `#${tag}`).join(' ')}</p>
          ) : null}

          <div className="rp-product-panel-actions">
            <button className="rp-product-order-btn" disabled={!product.inStock} onClick={onOrder}>
              {product.inStock ? 'הזמן' : 'חסר במלאי'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
