import { Route, Routes } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import { ProductCatalogProvider } from './context/ProductCatalogContext';
import { CategoryTreeProvider } from './context/CategoryTreeContext';

function AppLayout() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <CategoryTreeProvider>
      <ProductCatalogProvider>
        <AppLayout />
      </ProductCatalogProvider>
    </CategoryTreeProvider>
  );
}
