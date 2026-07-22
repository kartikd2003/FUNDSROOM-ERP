import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import InventoryDashboard from './pages/InventoryDashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerDetail from './pages/CustomerDetail';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import StockManagement from './pages/StockManagement';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';
import Challans from './pages/Challans';
import AddChallan from './pages/AddChallan';
import ChallanDetail from './pages/ChallanDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hasPermission } from './utils/permissions';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function PermissionRoute({ children, permission }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (permission && !hasPermission(user.role, permission)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: '#888', marginTop: '8px' }}>You do not have permission to access this page.</p>
        <a href="/" style={{ color: '#3b82f6', marginTop: '16px', display: 'inline-block' }}>Back to Dashboard</a>
      </div>
    );
  }
  return children;
}

function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<InventoryDashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/challans" element={<Challans />} />
          <Route path="/challans/add" element={<AddChallan />} />
          <Route path="/challans/:id" element={<ChallanDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

