import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function InventoryDashboard() {

  const { can } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [stockMovement, setStockMovement] = useState([]);
  const [activity, setActivity] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, moveRes, actRes, lowRes] = await Promise.all([
          axios.get('/api/inventory-dashboard/summary'),
          axios.get('/api/inventory-dashboard/category-stock'),
          axios.get('/api/inventory-dashboard/stock-movement'),
          axios.get('/api/inventory-dashboard/activity'),
          axios.get('/api/inventory-dashboard/low-stock')
        ]);
        setSummary(sumRes.data.data);
        setCategoryData(catRes.data.data);
        setStockMovement(moveRes.data.data);
        setActivity(actRes.data.data);
        setLowStock(lowRes.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');

  return (
    <div>
      <div className="page-header">
        <h1>📊 Inventory Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="cards-grid">
        <div className="card">
          <h3>Total Products</h3>
          <div className="value blue">{summary?.totalProducts || 0}</div>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <div className="value purple">{summary?.totalCategories || 0}</div>
        </div>
        <div className="card">
          <h3>Warehouses</h3>
          <div className="value orange">{summary?.totalWarehouses || 0}</div>
        </div>
        <div className="card">
          <h3>Low Stock</h3>
          <div className="value orange">{summary?.lowStock || 0}</div>
        </div>
        <div className="card">
          <h3>Out of Stock</h3>
          <div className="value red">{summary?.outOfStock || 0}</div>
        </div>
        <div className="card">
          <h3>Inventory Value</h3>
          <div className="value green">{formatCurrency(summary?.inventoryValue || 0)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Stock by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="stock" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No data available</p>}
        </div>
        <div className="chart-card">
          <h3>Monthly Stock Movement (Last 6 Months)</h3>
          {stockMovement.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="IN" fill="#22c55e" name="Stock In" />
                <Bar dataKey="OUT" fill="#ef4444" name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No movement data</p>}
        </div>
      </div>

      {/* Activity & Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="chart-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activity.length > 0 ? activity.map((item, i) => (
              <div className="activity-item" key={i}>
                <div className={`activity-icon ${item.type === 'IN' ? 'green' : 'red'}`}>
                  {item.type === 'IN' ? '↑' : '↓'}
                </div>
                <div className="activity-content">
                  <p><strong>{item.action}</strong> - {item.product}</p>
                  <small>{item.warehouse} · {item.quantity} units · {item.time}</small>
                </div>
              </div>
            )) : <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No recent activity</p>}
          </div>
        </div>
        <div className="chart-card">
          <h3>Low Stock Alerts</h3>
          {lowStock.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Min</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td>{item.sku}</td>
                    <td><span className="badge badge-danger">{item.currentStock}</span></td>
                    <td>{item.minimumStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>All products well stocked ✓</p>}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="chart-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          {can(PERMISSIONS.PRODUCT_CREATE) && <a href="/products/add" className="btn btn-primary">+ Add Product</a>}
          <a href="/products" className="btn btn-success">View Products</a>
          <a href="/analytics" className="btn btn-warning">View Analytics</a>
        </div>
      </div>
    </div>
  );
}

