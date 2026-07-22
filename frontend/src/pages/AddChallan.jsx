import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AddChallan() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get('/api/customers', { params: { limit: 200 } }),
          api.get('/api/products', { params: { limit: 200 } })
        ]);
        setCustomers(custRes.data.customers || []);
        setProducts(prodRes.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const addRow = () => setItems([...items, { productId: '', quantity: 1 }]);
  const removeRow = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const getProduct = (id) => products.find(p => p.id === Number(id));

  const total = items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p ? Number(p.unitPrice) * Number(item.quantity || 0) : 0);
  }, 0);

  const handleSubmit = async (status) => {
    setError('');
    if (!customerId) { setError('Please select a customer'); return; }
    const validItems = items.filter(i => i.productId && i.quantity > 0);
    if (validItems.length === 0) { setError('Add at least one product with quantity'); return; }

    setSubmitting(true);
    try {
      await api.post('/api/challans', {
        customerId,
        items: validItems.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
        status
      });
      navigate('/challans');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create challan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🧾 New Sales Challan</h1>
      </div>
      <div style={{ maxWidth: 800 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="table-container">
          <div className="form-group">
            <label>Customer *</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
              <option value="">Select customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.customerName} ({c.businessName})</option>
              ))}
            </select>
          </div>

          <label>Products *</label>
          {items.map((item, idx) => {
            const p = getProduct(item.productId);
            return (
              <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <select value={item.productId} onChange={e => updateRow(idx, 'productId', e.target.value)}>
                    <option value="">Select product</option>
                    {products.map(prod => (
                      <option key={prod.id} value={prod.id}>
                        {prod.productName} ({prod.sku}) — Stock: {prod.currentStock}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <input
                    type="number" min="1" value={item.quantity}
                    onChange={e => updateRow(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                  />
                </div>
                <div style={{ flex: 1, fontSize: 13, color: '#666' }}>
                  {p ? `₹${(Number(p.unitPrice) * Number(item.quantity || 0)).toLocaleString('en-IN')}` : '-'}
                </div>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRow(idx)} disabled={items.length === 1}>✕</button>
              </div>
            );
          })}
          <button type="button" className="btn btn-outline btn-sm" onClick={addRow} style={{ marginBottom: 20 }}>+ Add Product</button>

          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20, textAlign: 'right' }}>
            Total: ₹{total.toLocaleString('en-IN')}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/challans')}>Cancel</button>
            <button type="button" className="btn btn-outline" disabled={submitting} onClick={() => handleSubmit('DRAFT')}>
              Save as Draft
            </button>
            <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit('CONFIRMED')}>
              {submitting ? 'Saving...' : 'Save & Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}