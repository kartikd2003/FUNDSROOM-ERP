import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    productName: '', sku: '', categoryId: '', warehouseId: '',
    unitPrice: '', currentStock: '0', minimumStock: '0'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catRes, whRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/warehouses')
        ]);
        setCategories(catRes.data.data || []);
        setWarehouses(whRes.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        warehouseId: Number(form.warehouseId),
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minimumStock: Number(form.minimumStock)
      };
      await axios.post('/api/products', payload);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>➕ Add Product</h1>
      </div>
      <div style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="table-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input name="productName" value={form.productName} onChange={handleChange} required minLength={3} />
            </div>
            <div className="form-group">
              <label>SKU *</label>
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Warehouse *</label>
                <select name="warehouseId" value={form.warehouseId} onChange={handleChange} required>
                  <option value="">Select warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Unit Price *</label>
              <input name="unitPrice" type="number" step="0.01" min="0.01" value={form.unitPrice} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current Stock</label>
                <input name="currentStock" type="number" min="0" value={form.currentStock} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Minimum Stock</label>
                <input name="minimumStock" type="number" min="0" value={form.minimumStock} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/products')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

