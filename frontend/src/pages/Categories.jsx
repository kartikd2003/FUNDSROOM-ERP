import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Categories() {

  const { can } = useAuth();  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    
    try {
      await api.post('/api/categories', form);
      setMessage('Category created');
      setModal(null); setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/api/categories/${id}`, form);
      setMessage('Category updated');
      setModal(null); setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      setMessage('Category deleted');
      fetchCategories();
    } catch (err) { setMessage(err.response?.data?.message || 'Cannot delete. Products may exist.'); }
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setModal({ type: 'edit', id: cat.id });
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏷️ Categories</h1>
        {can(PERMISSIONS.CATEGORY_CREATE) && (
          <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '' }); setModal({ type: 'add' }); }}>
            + Add Category
          </button>
        )}
      </div>

      {message && <div className={`alert ${message.includes('Error') || message.includes('Cannot') ? 'alert-error' : 'alert-success'}`}>{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No categories found</td></tr>
              ) : categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.description || '-'}</td>
                  <td><span className="badge badge-info">{c._count?.products || 0}</span></td>
                  <td>
                    {can(PERMISSIONS.CATEGORY_UPDATE) && <button className="btn btn-sm btn-primary" onClick={() => openEdit(c)}>Edit</button>}
                    {can(PERMISSIONS.CATEGORY_DELETE) && <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(c.id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal.type === 'add' ? '➕ Add Category' : '✏️ Edit Category'}</h2>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength={3} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => modal.type === 'add' ? handleAdd() : handleEdit(modal.id)}>
                {modal.type === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


