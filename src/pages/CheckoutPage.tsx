import Header from '../components/Header';
import { CheckoutFooter } from '../components/PageFooters';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummaryCard from '../components/checkout/OrderSummaryCard';
import CommitmentsList from '../components/checkout/CommitmentsList';
import './CheckoutPage.css';

export default function CheckoutPage() {
  return (
    <div className="checkout-page">
      <Header currentPage="checkout" showSearch={false} />

      <main className="checkout-main">
        <div className="checkout-grid">
          <div className="checkout-form-col">
            <CheckoutForm />
          </div>

          <div className="checkout-aside-col">
            <OrderSummaryCard />
            <CommitmentsList />
          </div>
        </div>
      </main>

      <CheckoutFooter />
    </div>
  );
}
