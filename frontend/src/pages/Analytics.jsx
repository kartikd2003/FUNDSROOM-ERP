import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Analytics() {

  const { can } = useAuth();  const [monthlyMovement, setMonthlyMovement] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStock, setCategoryStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [moveRes, topRes, catRes] = await Promise.all([
          axios.get('/api/analytics/monthly-movement?months=6'),
          axios.get('/api/analytics/top-products?top=10'),
          axios.get('/api/analytics/category-stock')
        ]);
        setMonthlyMovement(moveRes.data.data || []);
        setTopProducts(topRes.data.data || []);
        setCategoryStock(catRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>📈 Analytics</h1>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Monthly Stock Movement</h3>
          {monthlyMovement.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyMovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="IN" stroke="#22c55e" strokeWidth={2} name="Stock In" />
                <Line type="monotone" dataKey="OUT" stroke="#ef4444" strokeWidth={2} name="Stock Out" />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No movement data</p>}
        </div>
        <div className="chart-card">
          <h3>Top Products by Stock Movement</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="product" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="IN" fill="#22c55e" name="Stock In" />
                <Bar dataKey="OUT" fill="#ef4444" name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No product movement data</p>}
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Stock by Category</h3>
          {categoryStock.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryStock}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#3b82f6" name="Total Stock" />
                <Bar dataKey="productCount" fill="#8b5cf6" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No category data</p>}
        </div>
        <div className="chart-card">
          <h3>Top Products Table</h3>
          {topProducts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock In</th>
                  <th>Stock Out</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i}>
                    <td><strong>{p.product}</strong></td>
                    <td><span className="badge badge-success">{p.IN || 0}</span></td>
                    <td><span className="badge badge-danger">{p.OUT || 0}</span></td>
                    <td><span className={`badge ${(p.IN - p.OUT) >= 0 ? 'badge-success' : 'badge-danger'}`}>{p.IN - p.OUT}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No data</p>}
        </div>
      </div>
    </div>
  );
}

