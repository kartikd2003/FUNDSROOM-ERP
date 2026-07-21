import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchCustomer(); }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`/api/customers/${id}/details`);
      setCustomer(res.data.data);
    } catch (err) {
      setMessage('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpNote.trim()) return;
    setSubmitting(true);
    try {
      const payload = { note: followUpNote };
      if (followUpDate) payload.followUpDate = followUpDate;
      await axios.post(`/api/customers/${id}/followup`, payload);
      setFollowUpNote('');
      setFollowUpDate('');
      setMessage('Follow-up added successfully');
      fetchCustomer();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const map = { LEAD: 'badge-warning', ACTIVE: 'badge-success', INACTIVE: 'badge-danger' };
    return `badge ${map[status] || 'badge-info'}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!customer) return <div className="loading">Customer not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1>👤 {customer.customerName}</h1>
        <div className="header-actions">
          <Link to="/customers" className="btn btn-outline">← Back to List</Link>
          <Link to={`/customers/edit/${customer.id}`} className="btn btn-primary">✏️ Edit</Link>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') || message.includes('Failed') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Customer Info */}
        <div className="table-container">
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>Customer Information</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td style={{ fontWeight: 600, width: '140px', color: '#555' }}>Full Name</td><td>{customer.customerName}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Business Name</td><td>{customer.businessName}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Mobile</td><td>{customer.mobile}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Email</td><td>{customer.email || '-'}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>GST Number</td><td>{customer.gstNumber || '-'}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Type</td><td><span className="badge badge-info">{customer.customerType}</span></td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Status</td><td><span className={statusBadge(customer.status)}>{customer.status}</span></td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Follow-Up Date</td><td>{customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString() : '-'}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Address</td><td>{customer.address}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Notes</td><td>{customer.notes || '-'}</td></tr>
              <tr><td style={{ fontWeight: 600, color: '#555' }}>Created</td><td>{new Date(customer.createdAt).toLocaleDateString()}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Add Follow-Up */}
        <div className="table-container">
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>📝 Add Follow-Up</h3>
          <form onSubmit={handleAddFollowUp}>
            <div className="form-group">
              <label>Follow-Up Note *</label>
              <textarea
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                rows={4}
                placeholder="Enter follow-up details..."
                required
                minLength={5}
              />
            </div>
            <div className="form-group">
              <label>Next Follow-Up Date</label>
              <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting || !followUpNote.trim()}>
              {submitting ? 'Saving...' : 'Add Follow-Up'}
            </button>
          </form>
        </div>
      </div>

      {/* Follow-Up Timeline */}
      <div className="table-container">
        <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>📋 Follow-Up History</h3>
        {customer.followUps && customer.followUps.length > 0 ? (
          <div className="activity-list">
            {customer.followUps.map((f) => (
              <div key={f.id} className="activity-item">
                <div className="activity-icon blue">📌</div>
                <div className="activity-content">
                  <p>{f.note}</p>
                  <small>
                    {f.followUpDate && <span>📅 Follow-up: {new Date(f.followUpDate).toLocaleDateString()} | </span>}
                    Added by {f.createdBy?.fullName || f.createdBy?.email || 'Unknown'} on {new Date(f.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#888', padding: '20px 0', textAlign: 'center' }}>No follow-ups recorded yet.</p>
        )}
      </div>
    </div>
  );
}

