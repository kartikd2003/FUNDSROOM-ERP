import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function AddCustomer() {

  const { can } = useAuth();  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'RETAIL',
    status: 'LEAD',
    address: '',
    followUpDate: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.followUpDate) delete payload.followUpDate;
      if (!payload.gstNumber) delete payload.gstNumber;
      if (!payload.email) delete payload.email;
      if (!payload.notes) delete payload.notes;
      await api.post('/api/customers', payload);
      navigate('/customers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>➕ Add Customer</h1>
      </div>
      <div style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="table-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name *</label>
                <input name="customerName" value={form.customerName} onChange={handleChange} required minLength={3} />
              </div>
              <div className="form-group">
                <label>Business Name *</label>
                <input name="businessName" value={form.businessName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} required minLength={10} placeholder="10 digit number" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="optional" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GST Number</label>
                <input name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="optional" />
              </div>
              <div className="form-group">
                <label>Customer Type *</label>
                <select name="customerType" value={form.customerType} onChange={handleChange} required>
                  <option value="RETAIL">Retail</option>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={form.status} onChange={handleChange} required>
                  <option value="LEAD">Lead</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Follow-Up Date</label>
                <input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea name="address" value={form.address} onChange={handleChange} required rows={3} placeholder="Full address" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes (optional)" />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/customers')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


