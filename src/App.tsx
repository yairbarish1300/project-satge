import { Route, Routes } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeesPage from './pages/EmployeesPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import InquiriesPage from './pages/InquiriesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ProductCatalogProvider } from './context/ProductCatalogContext';
import { CategoryTreeProvider } from './context/CategoryTreeContext';

function AppLayout() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute requiredRole="manager">
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inquiries"
          element={
            <ProtectedRoute>
              <InquiriesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CategoryTreeProvider>
        <ProductCatalogProvider>
          <AppLayout />
        </ProductCatalogProvider>
      </CategoryTreeProvider>
    </AuthProvider>
  );
}
