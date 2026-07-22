import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

export default function Challans() {
  const { can } = useAuth();
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [message, setMessage] = useState('');

  const fetchChallans = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/api/challans', { params });
      setChallans(res.data.data || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalRecords(res.data.totalRecords || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchChallans(); }, [fetchChallans]);

  const handleConfirm = async (id) => {
    if (!confirm('Confirm this challan? Stock will be reduced.')) return;
    try {
      await api.patch(`/api/challans/${id}/confirm`);
      setMessage('Challan confirmed');
      fetchChallans();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to confirm'); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this challan?')) return;
    try {
      await api.patch(`/api/challans/${id}/cancel`);
      setMessage('Challan cancelled');
      fetchChallans();
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to cancel'); }
  };

  const statusBadge = (status) => {
    const map = { DRAFT: 'badge-warning', CONFIRMED: 'badge-success', CANCELLED: 'badge-danger' };
    return `badge ${map[status] || 'badge-info'}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1>🧾 Sales Challans</h1>
        {can(PERMISSIONS.SALES_CREATE) && (
          <Link to="/challans/add" className="btn btn-primary">+ New Challan</Link>
        )}
      </div>

      {message && <div className={`alert ${message.includes('Failed') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      <div className="filters-bar">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span style={{ marginLeft: 'auto', color: '#888' }}>{totalRecords} challans found</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Challan #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Qty</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
            ) : challans.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No challans found</td></tr>
            ) : challans.map(c => (
              <tr key={c.id}>
                <td><strong>{c.challanNumber}</strong></td>
                <td>{c.customer?.customerName} <br /><small style={{ color: '#888' }}>{c.customer?.businessName}</small></td>
                <td>{c.items?.length || 0}</td>
                <td>{c.totalQuantity}</td>
                <td><span className={statusBadge(c.status)}>{c.status}</span></td>
                <td style={{ fontSize: 12, color: '#888' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Link to={`/challans/${c.id}`} className="btn btn-sm btn-primary">View</Link>
                    {c.status === 'DRAFT' && can(PERMISSIONS.SALES_CONFIRM) && (
                      <button className="btn btn-sm btn-success" onClick={() => handleConfirm(c.id)}>Confirm</button>
                    )}
                    {c.status !== 'CANCELLED' && can(PERMISSIONS.SALES_CANCEL) && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleCancel(c.id)}>Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="page-info">Page {page} of {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}