import Header from '../components/Header';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import { makePlaceholderImage } from '../utils/placeholderImage';
import './ProductPage.css';

const PRODUCT = {
  id: 'STG-9900-PRO',
  name: 'מערכת שמע היברידית V-STRIKE PRO',
  price: '₪ 12,500 / ליום',
  rating: 4.9,
  reviews: 124,
  description: 'המערכת המתקדמת ביותר בשוק לאירועי ענק. שילוב מושלם של טכנולוגיית סאונד קריסטלית עם תמיכה מלאה בתאורה חכמה ומסכי לדים.',
  mainImage: makePlaceholderImage('V-STRIKE PRO', { accent: '#4be277', secondary: '#adc6ff' }),
  thumbnails: [
    makePlaceholderImage('Front View', { accent: '#4be277', secondary: '#f59e0b' }),
    makePlaceholderImage('Side View', { accent: '#adc6ff', secondary: '#22c55e' }),
    makePlaceholderImage('Control View', { accent: '#fb7185', secondary: '#f59e0b' }),
  ],
};

export default function ProductPage() {
  return (
    <div className="rp-page">
      <Header currentPage="product" showSearch={true} />

      <main className="rp-main product-page">
        <section className="rp-product-layout">
          <ProductGallery productName={PRODUCT.name} mainImage={PRODUCT.mainImage} thumbnails={PRODUCT.thumbnails} />
          <ProductInfo
            id={PRODUCT.id}
            name={PRODUCT.name}
            description={PRODUCT.description}
            price={PRODUCT.price}
            rating={PRODUCT.rating}
            reviews={PRODUCT.reviews}
          />
        </section>
      </main>
    </div>
  );
}
