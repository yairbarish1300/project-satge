import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { CheckoutFooter } from '../components/PageFooters';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummaryCard from '../components/checkout/OrderSummaryCard';
import CommitmentsList from '../components/checkout/CommitmentsList';
import { useProductCatalog } from '../context/ProductCatalogContext';
import './CheckoutPage.css';

function rentalDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate || startDate > endDate) return 0;
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const { products, loading } = useProductCatalog();

  const product = useMemo(() => products.find((p) => p.id === productId) ?? null, [products, productId]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  const days = rentalDays(startDate, endDate);
  // Only a real ₪ figure once there's an actual date range — showing a
  // "1 day" price before any dates are chosen implied a total that wasn't real.
  const totalPrice = product && days > 0 ? product.price * quantity * days : 0;

  return (
    <div className="checkout-page">
      <Header currentPage="checkout" showSearch={false} />

      <main className="checkout-main">
        {loading ? (
          <p className="checkout-status-message">טוען...</p>
        ) : completedOrderNumber ? (
          <div className="checkout-success">
            <span className="msym">check_circle</span>
            <h2>ההזמנה נשלחה בהצלחה!</h2>
            <p>מספר ההזמנה שלך: <strong>{completedOrderNumber}</strong></p>
            <p>ניצור איתך קשר בקרוב לתיאום ההגעה והתשלום הסופי.</p>
            <button type="button" className="checkout-submit" onClick={() => navigate('/')}>
              <span>חזרה לדף הבית</span>
            </button>
          </div>
        ) : !product ? (
          <div className="checkout-success">
            <span className="msym">shopping_bag</span>
            <h2>לא נבחר מוצר להזמנה</h2>
            <p>יש לבחור מוצר מהחנות ולבקש הזמנה כדי להגיע לדף הזה.</p>
            <button type="button" className="checkout-submit" onClick={() => navigate('/shop')}>
              <span>מעבר לחנות</span>
            </button>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-form-col">
              <CheckoutForm
                product={product}
                startDate={startDate}
                endDate={endDate}
                quantity={quantity}
                days={days}
                totalPrice={totalPrice}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onQuantityChange={setQuantity}
                onOrderCreated={setCompletedOrderNumber}
              />
            </div>

            <div className="checkout-aside-col">
              <OrderSummaryCard product={product} quantity={quantity} days={days} totalPrice={totalPrice} />
              <CommitmentsList />
            </div>
          </div>
        )}
      </main>

      <CheckoutFooter />
    </div>
  );
}
