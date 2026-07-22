import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function ChallanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const [challan, setChallan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchChallan = async () => {
    try {
      const res = await api.get(`/api/challans/${id}`);
      setChallan(res.data.data);
    } catch (err) { setMessage('Failed to load challan'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchChallan(); }, [id]);

  const handleConfirm = async () => {
    if (!confirm('Confirm this challan? Stock will be reduced.')) return;
    try {
      await api.patch(`/api/challans/${id}/confirm`);
      setMessage('Challan confirmed');
      fetchChallan();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to confirm'); }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this challan?')) return;
    try {
      await api.patch(`/api/challans/${id}/cancel`);
      setMessage('Challan cancelled');
      fetchChallan();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to cancel'); }
  };

  const statusBadge = (status) => {
    const map = { DRAFT: 'badge-warning', CONFIRMED: 'badge-success', CANCELLED: 'badge-danger' };
    return `badge ${map[status] || 'badge-info'}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!challan) return <div className="loading">Challan not found</div>;

  const total = challan.items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);

  return (
    <div>
      <div className="page-header">
        <h1>{challan.challanNumber}</h1>
        <div className="header-actions">
          <Link to="/challans" className="btn btn-outline">Back to List</Link>
          {challan.status === 'DRAFT' && can(PERMISSIONS.SALES_CONFIRM) && (
            <button className="btn btn-success" onClick={handleConfirm}>Confirm</button>
          )}
          {challan.status !== 'CANCELLED' && can(PERMISSIONS.SALES_CANCEL) && (
            <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
          )}
        </div>
      </div>

      {message && <div className={`alert ${message.includes('Failed') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      <div className="table-container" style={{ marginBottom: 16 }}>
        <p><strong>Status:</strong> <span className={statusBadge(challan.status)}>{challan.status}</span></p>
        <p><strong>Customer:</strong> {challan.customer.customerName} ({challan.customer.businessName})</p>
        <p><strong>Created By:</strong> {challan.createdBy?.fullName}</p>
        <p><strong>Date:</strong> {new Date(challan.createdAt).toLocaleString()}</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map(item => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td>₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                <td>{item.quantity}</td>
                <td>₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 16, marginTop: 12 }}>
          Total: ₹{total.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}