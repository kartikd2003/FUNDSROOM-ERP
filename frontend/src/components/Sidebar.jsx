import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Sidebar() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>📦 Inventory</h2>
      <nav>
        {can(PERMISSIONS.DASHBOARD_VIEW) && (
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
        )}
        {can(PERMISSIONS.CUSTOMER_VIEW) && (
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">👥</span>
            <span>Customers</span>
          </NavLink>
        )}
        {can(PERMISSIONS.PRODUCT_VIEW) && (
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📦</span>
            <span>Products</span>
          </NavLink>
        )}
        {can(PERMISSIONS.CATEGORY_VIEW) && (
          <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">🏷️</span>
            <span>Categories</span>
          </NavLink>
        )}
        {can(PERMISSIONS.WAREHOUSE_VIEW) && (
          <NavLink to="/warehouses" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">🏭</span>
            <span>Warehouses</span>
          </NavLink>
        )}
        {can(PERMISSIONS.INVENTORY_MOVEMENT_VIEW) && (
          <NavLink to="/stock" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📋</span>
            <span>Stock Movements</span>
          </NavLink>
        )}
        {can(PERMISSIONS.INVENTORY_ANALYTICS) && (
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📈</span>
            <span>Analytics</span>
          </NavLink>
        )}
        {can(PERMISSIONS.AUDIT_VIEW) && (
          <NavLink to="/audit" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📝</span>
            <span>Audit Logs</span>
          </NavLink>
        )}
      </nav>
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
          {user?.name || user?.email}
          <br />
          <span style={{ color: '#3b82f6', fontWeight: 600 }}>{user?.role}</span>
        </div>
        <button className="btn btn-sm btn-outline" style={{ color: '#ccc', borderColor: '#555' }} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
