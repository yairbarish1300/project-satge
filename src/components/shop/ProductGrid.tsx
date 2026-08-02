import type { CatalogProduct } from '../../context/ProductCatalogContext';

interface ProductGridProps {
  products: CatalogProduct[];
  onSelect: (product: CatalogProduct) => void;
}

export default function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="rp-products-grid">
      {products.map((p) => (
        <article
          className="rp-card rp-product-card rp-product-clickable"
          key={p.id}
          onClick={() => onSelect(p)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(p);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img src={p.image} alt={p.name} />
          <div className="rp-card-body">
            <div className="sku">{p.sku}</div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="rp-cta-row rp-between-row">
              <span className="price">₪ {p.price} {p.unit}</span>
              <span className={`rp-tag ${p.inStock ? 'in' : 'out'}`}>{p.inStock ? 'במלאי' : 'חסר מלאי'}</span>
            </div>
            {p.tags.length ? <p className="rp-product-tags">{p.tags.map((tag) => `#${tag}`).join(' ')}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
