import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>📦 Inventory</h2>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">👥</span>
          <span>Customers</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📦</span>
          <span>Products</span>
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">🏷️</span>
          <span>Categories</span>
        </NavLink>
        <NavLink to="/warehouses" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">🏭</span>
          <span>Warehouses</span>
        </NavLink>
        <NavLink to="/stock" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📋</span>
          <span>Stock Movements</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📈</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="icon">📝</span>
          <span>Audit Logs</span>
        </NavLink>
      </nav>
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
          {user?.fullName || user?.email}
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

