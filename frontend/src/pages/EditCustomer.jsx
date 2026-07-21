import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/customers/${id}`);
        const c = res.data.data;
        setForm({
          customerName: c.customerName,
          mobile: c.mobile,
          email: c.email || '',
          businessName: c.businessName,
          gstNumber: c.gstNumber || '',
          customerType: c.customerType,
          status: c.status,
          address: c.address,
          followUpDate: c.followUpDate ? c.followUpDate.split('T')[0] : '',
          notes: c.notes || ''
        });
      } catch (err) {
        setError('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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
      await axios.put(`/api/customers/${id}`, payload);
      navigate('/customers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>✏️ Edit Customer</h1>
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
                <input name="mobile" value={form.mobile} onChange={handleChange} required minLength={10} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GST Number</label>
                <input name="gstNumber" value={form.gstNumber} onChange={handleChange} />
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
              <textarea name="address" value={form.address} onChange={handleChange} required rows={3} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/customers')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

