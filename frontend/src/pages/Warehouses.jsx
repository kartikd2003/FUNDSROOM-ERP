import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', location: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('/api/warehouses');
      setWarehouses(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleAdd = async () => {
    try {
      await axios.post('/api/warehouses', form);
      setMessage('Warehouse created');
      setModal(null); setForm({ name: '', location: '' });
      fetchWarehouses();
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`/api/warehouses/${id}`, form);
      setMessage('Warehouse updated');
      setModal(null); setForm({ name: '', location: '' });
      fetchWarehouses();
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this warehouse?')) return;
    try {
      await axios.delete(`/api/warehouses/${id}`);
      setMessage('Warehouse deleted');
      fetchWarehouses();
    } catch (err) { setMessage(err.response?.data?.message || 'Cannot delete. Products may exist.'); }
  };

  const openEdit = (wh) => {
    setForm({ name: wh.name, location: wh.location || '' });
    setModal({ type: 'edit', id: wh.id });
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏭 Warehouses</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', location: '' }); setModal({ type: 'add' }); }}>
          + Add Warehouse
        </button>
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
                <th>Location</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No warehouses found</td></tr>
              ) : warehouses.map(w => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td><strong>{w.name}</strong></td>
                  <td>{w.location || '-'}</td>
                  <td><span className="badge badge-info">{w._count?.products || 0}</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(w)}>Edit</button>
                    <button className="btn btn-sm btn-danger" style={{ marginLeft: 4 }} onClick={() => handleDelete(w.id)}>Delete</button>
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
            <h2>{modal.type === 'add' ? '➕ Add Warehouse' : '✏️ Edit Warehouse'}</h2>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength={3} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
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

