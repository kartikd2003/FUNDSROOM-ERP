import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function StockManagement() {

  const { can } = useAuth();  const [movements, setMovements] = useState([]);
  const [productHistory, setProductHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all');
  const [productId, setProductId] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [moveRes, prodRes] = await Promise.all([
          axios.get('/api/stock'),
          axios.get('/api/products', { params: { limit: 200 } })
        ]);
        setMovements(moveRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const fetchHistory = async () => {
    if (!productId) return;
    try {
      const res = await axios.get(`/api/stock/${productId}/history`);
      setProductHistory(res.data.data || []);
      setView('history');
    } catch (err) { console.error(err); }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchProduct.toLowerCase())
  );

  if (loading) return <div className="loading">Loading stock movements...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>📋 Stock Movements</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn ${view === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('all')}>All Movements</button>
          <button className={`btn ${view === 'history' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('history')}>By Product</button>
        </div>
      </div>

      {view === 'history' && (
        <div className="table-container" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Search Product</label>
              <input value={searchProduct} onChange={e => setSearchProduct(e.target.value)} placeholder="Type product name..." />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Select Product</label>
              <select value={productId} onChange={e => setProductId(e.target.value)}>
                <option value="">Choose product</option>
                {filteredProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.productName} ({p.sku})</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={fetchHistory}>View History</button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {view === 'all' ? (
              movements.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No movements found</td></tr>
              ) : movements.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><strong>{m.product?.productName || '-'}</strong></td>
                  <td>{m.warehouse?.name || '-'}</td>
                  <td><span className={`badge ${m.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>{m.type}</span></td>
                  <td>{m.quantity}</td>
                  <td>{m.reason || '-'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{formatDate(m.createdAt)}</td>
                </tr>
              ))
            ) : (
              productHistory.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No history for this product</td></tr>
              ) : productHistory.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><strong>{m.product?.productName || '-'}</strong></td>
                  <td>{m.warehouse?.name || '-'}</td>
                  <td><span className={`badge ${m.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>{m.type}</span></td>
                  <td>{m.quantity}</td>
                  <td>{m.reason || '-'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{formatDate(m.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

