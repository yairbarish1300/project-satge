interface ProductInfoProps {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
}

export default function ProductInfo({ id, name, description, price, rating, reviews }: ProductInfoProps) {
  return (
    <div className="rp-product-info">
      <div className="rp-hero-badge">ID: {id}</div>
      <h2>{name}</h2>
      <p className="rp-muted">{description}</p>
      <div className="rp-price">{price}</div>
      <p className="rp-muted">★ {rating} ({reviews} חוות דעת)</p>
      <div className="rp-cta-row">
        <button className="rp-btn-primary">הזמן עכשיו</button>
        <button className="rp-btn-secondary">הוסף לסל ההשכרות</button>
      </div>
    </div>
  );
}
